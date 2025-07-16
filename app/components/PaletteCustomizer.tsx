import React, { useState, useEffect, useCallback, useMemo } from "react";
import { formatCss, parse } from "culori";
import { downloadPaletteJson } from "./JsonExporter";
import { generatePalette } from "./palette-utils";

// === TYPES ===
const COLOR_SETS = [
  { key: "neutral", label: "Neutral" },
  { key: "brand", label: "Brand" },
  { key: "danger", label: "Danger" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const;

export type ColorKey = (typeof COLOR_SETS)[number]["key"];
export type ThemeMode = "light" | "dark";

interface LuminanceParams {
  mL: number;
  cL: number;
}

interface ChromaParams {
  mC: number;
  cC: number;
}

interface HuesState {
  light: Record<ColorKey, number>;
  dark: Record<ColorKey, number>;
}

interface LuminanceState {
  light: Record<ColorKey, LuminanceParams>;
  dark: Record<ColorKey, LuminanceParams>;
}

interface ChromaState {
  light: Record<ColorKey, ChromaParams>;
  dark: Record<ColorKey, ChromaParams>;
}

interface RadiusStep {
  var: string;
  label: string;
  value: number;
}

interface ColorStep {
  l: number;
  c: number;
  h: number;
  css: string;
}

// === CONSTANTS ===
const DEFAULT_HUES: HuesState = {
  light: {
    neutral: 360,
    brand: 360,
    danger: 28,
    warning: 90,
    success: 129,
    info: 237,
  },
  dark: {
    neutral: 360,
    brand: 355,
    danger: 28,
    warning: 90,
    success: 129,
    info: 237,
  },
};

const DEFAULT_LUMINANCE: LuminanceParams = { mL: 0.99, cL: 0.2 };

const DEFAULT_LUMINANCE_LIGHT: Record<ColorKey, LuminanceParams> = {
  neutral: { mL: 0.99, cL: 0.2 },
  brand: { mL: 0.99, cL: 0.25 },
  danger: { mL: 0.99, cL: 0.24 },
  warning: { mL: 0.98, cL: 0.61 },
  success: { mL: 0.99, cL: 0.24 },
  info: { mL: 0.96, cL: 0.28 },
};
const DEFAULT_LUMINANCE_DARK: Record<ColorKey, LuminanceParams> = {
  neutral: { mL: 0.85, cL: 0.12 },
  brand: { mL: 0.99, cL: 0.04 },
  danger: { mL: 0.95, cL: 0.12 },
  warning: { mL: 0.95, cL: 0.33 },
  success: { mL: 0.95, cL: 0.14 },
  info: { mL: 0.9, cL: 0.04 },
};

const DEFAULT_CHROMA: ChromaParams = { mC: 0.1, cC: 0.04 };

const DEFAULT_CHROMA_LIGHT: Record<ColorKey, ChromaParams> = {
  neutral: { mC: 0.06, cC: 0.06 },
  brand: { mC: 0.03, cC: 0.28 },
  danger: { mC: 0.03, cC: 0.25 },
  warning: { mC: 0.02, cC: 0.37 },
  success: { mC: 0.03, cC: 0.37 },
  info: { mC: 0.0, cC: 0.2 },
};
const DEFAULT_CHROMA_DARK: Record<ColorKey, ChromaParams> = {
  neutral: { mC: 0.0, cC: 0.02 },
  brand: { mC: 0.02, cC: 0.3 },
  danger: { mC: 0.02, cC: 0.2 },
  warning: { mC: 0.02, cC: 0.22 },
  success: { mC: 0.02, cC: 0.37 },
  info: { mC: 0.01, cC: 0.19 },
};

export const ROUNDED_VARS = [
  { var: "--box-rounded", label: "Box" },
  { var: "--card-rounded", label: "Card" },
  { var: "--input-rounded", label: "Input" },
  { var: "--button-rounded", label: "Button" },
] as const;

export const FONT_VARS = [
  {
    var: "--font-sans",
    label: "Sans",
    defaultValue: '"Nunito Sans", system-ui, -apple-system, sans-serif',
  },
  {
    var: "--font-monos",
    label: "Monospace",
    defaultValue: '"SF Mono", Consolas, monospace',
  },
] as const;

// === UTILITY FUNCTIONS ===
function updateOklchHue(oklchStr: string, newHue: number): string {
  const parsed = parse(oklchStr);
  if (!parsed || parsed.mode !== "oklch") return oklchStr;
  return formatCss({
    l: parsed.l,
    c: parsed.c,
    h: newHue,
    mode: "oklch",
  });
}

function generateLinearLuminanceSteps({
  m,
  c,
  steps,
}: {
  m: number;
  c: number;
  steps: number;
}): number[] {
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const x = 1 - i / (steps - 1);
    arr.push(c + (m - c) * x);
  }
  return arr;
}

function generateLinearChromaSteps({
  m,
  c,
  steps,
}: {
  m: number;
  c: number;
  steps: number;
}): number[] {
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const x = 1 - i / (steps - 1);
    arr.push((1 - x) * c + x * m);
  }
  return arr;
}

// Função utilitária para gerar steps de chroma com curva senoidal (máximo no centro)
function generateSineChromaSteps({
  min,
  max,
  steps,
  exponent = 1,
}: {
  min: number;
  max: number;
  steps: number;
  exponent?: number;
}): number[] {
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    // Senoidal: máximo no centro, mínimo nas pontas, ajustável pelo expoente
    // Ajuste para ser mais tolerante com a cor 950 (última cor)
    let chroma;
    if (i === steps - 1) {
      // Para a última cor (950), usar um valor entre 5% e 10% do caminho entre min e max
      const factor = 0.05 + Math.random() * 0.05; // 5% a 10%
      chroma = min + (max - min) * factor;
    } else {
      // Curva senoidal normal para as outras cores
      chroma = min + (max - min) * Math.pow(Math.sin(Math.PI * t), exponent);
    }
    arr.push(chroma);
  }
  return arr;
}

// Função para curva sigmóide pura (sem efeito Bezold-Brücke)
function generatePureSigmoidHueShiftSteps({
  maxShift,
  steps,
  exponent = 1,
}: {
  maxShift: number;
  steps: number;
  exponent?: number;
}): number[] {
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);

    // Curva sigmóide pura: shift máximo no centro, zero nas pontas
    const k = 4 * exponent; // Controle da inclinação
    const sigmoid = 2 * (1 / (1 + Math.exp(-k * (t - 0.5)))) - 1;

    // Shift máximo no centro (t = 0.5), zero nas pontas
    const shift = maxShift * sigmoid;
    arr.push(shift);
  }
  return arr;
}

// Função utilitária para limitar o chroma máximo permitido para cada hue (OKLCH)
function getMaxChromaForHue(hue: number): number {
  // Valores aproximados para OKLCH (pode ser refinado conforme necessidade)
  if (hue >= 20 && hue <= 40) return 0.3; // vermelho/laranja
  if (hue >= 60 && hue <= 100) return 0.35; // amarelo/verde
  if (hue >= 120 && hue <= 160) return 0.32; // verde
  if (hue >= 200 && hue <= 260) return 0.3; // azul
  return 0.2; // padrão conservador para outros casos
}

// === MAPPINGS ===
export const VARS: Record<ColorKey, string[]> = {
  neutral: [
    "--neutral-50",
    "--neutral-100",
    "--neutral-200",
    "--neutral-300",
    "--neutral-400",
    "--neutral-500",
    "--neutral-600",
    "--neutral-700",
    "--neutral-800",
    "--neutral-900",
    "--neutral-950",
  ],
  brand: [
    "--brand-50",
    "--brand-100",
    "--brand-200",
    "--brand-300",
    "--brand-400",
    "--brand-500",
    "--brand-600",
    "--brand-700",
    "--brand-800",
    "--brand-900",
    "--brand-950",
  ],
  danger: [
    "--danger-50",
    "--danger-100",
    "--danger-200",
    "--danger-300",
    "--danger-400",
    "--danger-500",
    "--danger-600",
    "--danger-700",
    "--danger-800",
    "--danger-900",
    "--danger-950",
  ],
  warning: [
    "--warning-50",
    "--warning-100",
    "--warning-200",
    "--warning-300",
    "--warning-400",
    "--warning-500",
    "--warning-600",
    "--warning-700",
    "--warning-800",
    "--warning-900",
    "--warning-950",
  ],
  success: [
    "--success-50",
    "--success-100",
    "--success-200",
    "--success-300",
    "--success-400",
    "--success-500",
    "--success-600",
    "--success-700",
    "--success-800",
    "--success-900",
    "--success-950",
  ],
  info: [
    "--info-50",
    "--info-100",
    "--info-200",
    "--info-300",
    "--info-400",
    "--info-500",
    "--info-600",
    "--info-700",
    "--info-800",
    "--info-900",
    "--info-950",
  ],
};

export const ORIGINALS: {
  light: Record<ColorKey, string[]>;
  dark: Record<ColorKey, string[]>;
} = {
  light: {
    neutral: [
      "oklch(0.97 0.004 180)",
      "oklch(0.95 0.005 180)",
      "oklch(0.92 0.01 180)",
      "oklch(0.86 0.015 180)",
      "oklch(0.78 0.018 180)",
      "oklch(0.64 0.022 180)",
      "oklch(0.53 0.024 180)",
      "oklch(0.43 0.021 180)",
      "oklch(0.35 0.021 180)",
      "oklch(0.25 0.021 180)",
      "oklch(0.15 0.01 180)",
    ],
    brand: [
      "oklch(0.962 0.007 171)",
      "oklch(0.93 0.025 172.044)",
      "oklch(0.87 0.06 174.001)",
      "oklch(0.785 0.11 176.774)",
      "oklch(0.65 0.18 180.428)",
      "oklch(0.55 0.233 183.299)",
      "oklch(0.48 0.262 185.713)",
      "oklch(0.437 0.24 187.475)",
      "oklch(0.378 0.195 189.4)",
      "oklch(0.31 0.14 190.672)",
      "oklch(0.25 0.1 194)",
    ],
    danger: [
      "oklch(0.962 0.018 28)",
      "oklch(0.93 0.034 27.637)",
      "oklch(0.87 0.065 26.956)",
      "oklch(0.785 0.115 25.991)",
      "oklch(0.673 0.182 24.721)",
      "oklch(0.585 0.233 23.722)",
      "oklch(0.511 0.262 22.882)",
      "oklch(0.457 0.24 22.27)",
      "oklch(0.3 0.195 21.6)",
      "oklch(0.2 0.144 21.157)",
      "oklch(0.15 0.09 20)",
    ],
    warning: [
      "oklch(0.987 0.026 71)",
      "oklch(0.973 0.071 71.379)",
      "oklch(0.95 0.12 72.003)",
      "oklch(0.9 0.16 73.223)",
      "oklch(0.84 0.185 74.659)",
      "oklch(0.78 0.185 76.204)",
      "oklch(0.67 0.165 79.294)",
      "oklch(0.554 0.14 82.736)",
      "oklch(0.476 0.13 84.85)",
      "oklch(0.421 0.1 86.341)",
      "oklch(0.286 0.066 90)",
    ],
    success: [
      "oklch(0.962 0.018 145)",
      "oklch(0.93 0.034 145.454)",
      "oklch(0.87 0.065 146.305)",
      "oklch(0.785 0.115 147.511)",
      "oklch(0.673 0.182 149.099)",
      "oklch(0.585 0.233 150.348)",
      "oklch(0.511 0.262 151.397)",
      "oklch(0.457 0.24 152.163)",
      "oklch(0.398 0.195 153)",
      "oklch(0.359 0.144 153.553)",
      "oklch(0.257 0.09 155)",
    ],
    info: [
      "oklch(0.962 0.018 232)",
      "oklch(0.93 0.034 232.454)",
      "oklch(0.87 0.065 233.305)",
      "oklch(0.785 0.115 234.511)",
      "oklch(0.673 0.182 236.099)",
      "oklch(0.585 0.233 237.348)",
      "oklch(0.511 0.262 238.397)",
      "oklch(0.457 0.24 239.163)",
      "oklch(0.398 0.195 240)",
      "oklch(0.359 0.144 240.553)",
      "oklch(0.257 0.09 242)",
    ],
  },
  dark: {
    neutral: [
      "oklch(0.97 0.004 180)",
      "oklch(0.95 0.005 180)",
      "oklch(0.85 0.01 180)",
      "oklch(0.72 0.014 180)",
      "oklch(0.64 0.016 180)",
      "oklch(0.52 0.02 180)",
      "oklch(0.38 0.008 180)",
      "oklch(0.28 0.008 180)",
      "oklch(0.22 0.008 180)",
      "oklch(0.18 0.01 180)",
      "oklch(0.14 0.015 180)",
    ],
    brand: [
      "oklch(0.95 0.012 171)",
      "oklch(0.92 0.03 172.044)",
      "oklch(0.85 0.064 174.001)",
      "oklch(0.75 0.12 176.774)",
      "oklch(0.62 0.22 180.428)",
      "oklch(0.55 0.24 183.299)",
      "oklch(0.48 0.28 185.713)",
      "oklch(0.42 0.26 187.475)",
      "oklch(0.3 0.2 189.4)",
      "oklch(0.2 0.16 190.672)",
      "oklch(0.15 0.12 194)",
    ],
    danger: [
      "oklch(0.95 0.022 28)",
      "oklch(0.91 0.038 27.637)",
      "oklch(0.84 0.075 26.956)",
      "oklch(0.75 0.13 25.991)",
      "oklch(0.64 0.21 24.721)",
      "oklch(0.55 0.25 23.722)",
      "oklch(0.48 0.28 22.882)",
      "oklch(0.42 0.26 22.27)",
      "oklch(0.36 0.2 21.6)",
      "oklch(0.28 0.16 21.157)",
      "oklch(0.2 0.12 20)",
    ],
    warning: [
      "oklch(0.97 0.03 71)",
      "oklch(0.94 0.08 71.379)",
      "oklch(0.89 0.14 72.003)",
      "oklch(0.82 0.19 73.223)",
      "oklch(0.74 0.23 74.659)",
      "oklch(0.67 0.25 76.204)",
      "oklch(0.59 0.23 79.294)",
      "oklch(0.5 0.19 82.736)",
      "oklch(0.42 0.16 84.85)",
      "oklch(0.33 0.13 86.341)",
      "oklch(0.24 0.1 90)",
    ],
    success: [
      "oklch(0.95 0.022 145)",
      "oklch(0.91 0.038 145.454)",
      "oklch(0.84 0.075 146.305)",
      "oklch(0.75 0.13 147.511)",
      "oklch(0.64 0.21 149.099)",
      "oklch(0.55 0.25 150.348)",
      "oklch(0.48 0.28 151.397)",
      "oklch(0.42 0.26 152.163)",
      "oklch(0.36 0.2 153)",
      "oklch(0.28 0.16 153.553)",
      "oklch(0.2 0.12 155)",
    ],
    info: [
      "oklch(0.95 0.022 232)",
      "oklch(0.91 0.038 232.454)",
      "oklch(0.84 0.075 233.305)",
      "oklch(0.75 0.13 234.511)",
      "oklch(0.64 0.21 236.099)",
      "oklch(0.55 0.25 237.348)",
      "oklch(0.48 0.28 238.397)",
      "oklch(0.42 0.26 239.163)",
      "oklch(0.36 0.2 240)",
      "oklch(0.28 0.16 240.553)",
      "oklch(0.2 0.12 242)",
    ],
  },
};

// === CONSTANTS ===
const DEFAULT_HUESHIFT: Record<ThemeMode, Record<ColorKey, number>> = {
  light: {
    neutral: 0,
    brand: 0,
    danger: 0,
    warning: 0,
    success: 0,
    info: 0,
  },
  dark: {
    neutral: 0,
    brand: 0,
    danger: 0,
    warning: 0,
    success: 0,
    info: 0,
  },
};

// === COMPONENT ===
export function PaletteCustomizer() {
  // Estado dos HUEs
  const [hues, setHues] = useState<HuesState>(() => {
    const saved = localStorage.getItem("customPaletteHues");
    if (saved) return JSON.parse(saved);
    return DEFAULT_HUES;
  });

  // Estado do hueShift por cor e tema
  const [hueShift, setHueShift] = useState<
    Record<ThemeMode, Record<ColorKey, number>>
  >(() => {
    const saved = localStorage.getItem("customPaletteHueShift");
    if (saved) return JSON.parse(saved);
    return DEFAULT_HUESHIFT;
  });

  // Persistência do hueShift
  useEffect(() => {
    localStorage.setItem("customPaletteHueShift", JSON.stringify(hueShift));
  }, [hueShift]);

  // Luminância agora é por cor e por tema
  const [luminance, setLuminance] = useState<LuminanceState>(() => {
    const saved = localStorage.getItem("customPaletteLuminance");
    if (saved) return JSON.parse(saved);
    return {
      light: { ...DEFAULT_LUMINANCE_LIGHT },
      dark: { ...DEFAULT_LUMINANCE_DARK },
    };
  });

  // Salva luminância customizada no localStorage
  useEffect(() => {
    localStorage.setItem("customPaletteLuminance", JSON.stringify(luminance));
  }, [luminance]);

  // Chroma agora é por cor e por tema
  const [chroma, setChroma] = useState<ChromaState>(() => {
    const saved = localStorage.getItem("customPaletteChroma");
    if (saved) return JSON.parse(saved);
    return {
      light: { ...DEFAULT_CHROMA_LIGHT },
      dark: { ...DEFAULT_CHROMA_DARK },
    };
  });

  // Salva chroma customizado no localStorage
  useEffect(() => {
    localStorage.setItem("customPaletteChroma", JSON.stringify(chroma));
  }, [chroma]);

  // Atualiza localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("customPaletteHues", JSON.stringify(hues));
  }, [hues]);

  // Estado do tema atual (light/dark) para detectar mudanças
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    return typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  // Observa mudanças na classe do html para detectar troca de tema
  useEffect(() => {
    const handler = () => {
      setCurrentTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };
    const observer = new MutationObserver(handler);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("themeChange", handler);
    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", handler);
    };
  }, []);

  // Atualizar estado para tolerância e pico por tema
  // Inicializar toleranceFactor e sineExponent lendo do localStorage apenas uma vez
  const [toleranceFactor, setToleranceFactor] = useState<{
    light: number;
    dark: number;
  }>(() => {
    const saved = localStorage.getItem("customPaletteToleranceFactor");
    return saved ? JSON.parse(saved) : { light: 1, dark: 1 };
  });
  const [sineExponent, setSineExponent] = useState<{
    light: number;
    dark: number;
  }>(() => {
    const saved = localStorage.getItem("customPaletteSineExponent");
    return saved ? JSON.parse(saved) : { light: 1, dark: 1 };
  });

  // Debounced save para toleranceFactor
  const debouncedSaveTolerance = useMemo(
    () =>
      debounce((val) => {
        localStorage.setItem(
          "customPaletteToleranceFactor",
          JSON.stringify(val)
        );
      }, 200),
    []
  );
  useEffect(() => {
    debouncedSaveTolerance(toleranceFactor);
  }, [toleranceFactor, debouncedSaveTolerance]);
  // Debounced save para sineExponent
  const debouncedSaveSine = useMemo(
    () =>
      debounce((val) => {
        localStorage.setItem("customPaletteSineExponent", JSON.stringify(val));
      }, 200),
    []
  );
  useEffect(() => {
    debouncedSaveSine(sineExponent);
  }, [sineExponent, debouncedSaveSine]);

  // Remover estado bezoldBrueckeEnabled e hueShiftMode - usar apenas sigmóide pura
  // const [bezoldBrueckeEnabled, setBezoldBrueckeEnabled] = useState<{ light: boolean; dark: boolean }>(() => {
  //   const saved = localStorage.getItem("customPaletteBezoldBrueckeEnabled");
  //   return saved ? JSON.parse(saved) : { light: true, dark: true };
  // });
  // useEffect(() => {
  //   localStorage.setItem("customPaletteBezoldBrueckeEnabled", JSON.stringify(bezoldBrueckeEnabled));
  // }, [bezoldBrueckeEnabled]);

  // Remover estado para o modo de hue shift global
  // type HueShiftMode = 'bezold' | 'sigmoid' | 'off';
  // const [hueShiftMode, setHueShiftMode] = useState<{ light: HueShiftMode; dark: HueShiftMode }>(() => {
  //   const saved = localStorage.getItem("customPaletteHueShiftMode");
  //   return saved ? JSON.parse(saved) : { light: 'bezold', dark: 'bezold' };
  // });
  // useEffect(() => {
  //   localStorage.setItem("customPaletteHueShiftMode", JSON.stringify(hueShiftMode));
  // }, [hueShiftMode]);

  // Remover estado colorMode - sempre usar senoidal
  // const [colorMode, setColorMode] = useState<"hard" | "soft">("soft");

  // Atualiza as variáveis CSS no DOM ao mudar HUE, luminância ou chroma custom
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-brand") !== "custom") return;
    ["light", "dark"].forEach((mode) => {
      const modeKey = mode as ThemeMode;
      const isDark = modeKey === "dark";
      const target = isDark
        ? root.classList.contains("dark")
        : !root.classList.contains("dark");
      if (!target) return;
      console.log(
        "Aplicando",
        modeKey,
        "target?",
        target,
        "html.classList:",
        root.classList.value
      );
      COLOR_SETS.forEach(({ key }) => {
        // Gera os steps customizados para cada cor
        const lum = luminance[modeKey][key];
        const chr = chroma[modeKey][key];
        const hue = hues[modeKey][key];
        const shift = hueShift[modeKey][key];
        const steps = VARS[key].length;

        // Gera steps customizados para luminância e chroma
        const lightnessSteps = generateLinearLuminanceSteps({
          m: lum.mL,
          c: lum.cL,
          steps,
        });
        const chromaMax = Math.min(
          chr.cC,
          getMaxChromaForHue(hue) * toleranceFactor[modeKey]
        );
        // Sempre usar curva senoidal
        const chromaSteps = generateSineChromaSteps({
          min: chr.mC,
          max: chromaMax,
          steps,
          exponent: sineExponent[modeKey],
        });

        // Gera steps de hue shift com curva sigmóide pura
        const hueShiftSteps = generatePureSigmoidHueShiftSteps({
          maxShift: shift,
          steps,
          exponent: sineExponent[modeKey],
        });

        const palette = generatePalette({
          baseHue: hue,
          steps,
          customLightnessSteps: lightnessSteps,
          customChromaSteps: chromaSteps,
          customHueShiftSteps: hueShiftSteps,
        });

        VARS[key].forEach((cssVar, idx) => {
          root.style.setProperty(cssVar, palette[idx].oklch);
        });
      });
    });

    // Dispara evento para notificar mudanças de cor
    window.dispatchEvent(new CustomEvent("paletteChange"));
  }, [
    hues,
    luminance,
    chroma,
    hueShift,
    currentTheme,
    toleranceFactor,
    sineExponent,
    // bezoldBrueckeEnabled,
    // hueShiftMode,
  ]);

  // Limpa variáveis customizadas ao sair da brand custom
  useEffect(() => {
    const root = document.documentElement;
    const brand = root.getAttribute("data-brand");
    if (brand !== "custom") {
      Object.values(VARS).forEach((varsArr) => {
        varsArr.forEach((cssVar) => {
          root.style.removeProperty(cssVar);
        });
      });
    }
  }, [
    typeof window !== "undefined" &&
      document.documentElement.getAttribute("data-brand"),
  ]);

  // Handler para mudar o HUE
  function handleHueChange(mode: ThemeMode, key: ColorKey, value: number) {
    setHues((prev: HuesState) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: value,
      },
    }));
  }

  // Handler para mudar o hue shift
  function handleHueShiftChange(mode: ThemeMode, key: ColorKey, value: number) {
    setHueShift((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: value,
      },
    }));
  }

  // Função para resetar os HUEs, luminância e chroma para o padrão do modo atual
  function handleReset() {
    setHues((prev) => ({
      ...prev,
      [currentTheme]: { ...DEFAULT_HUES[currentTheme] },
    }));
    setHueShift((prev) => ({
      ...prev,
      [currentTheme]: { ...DEFAULT_HUESHIFT[currentTheme] },
    }));
    setLuminance((prev) => ({
      ...prev,
      [currentTheme]: {
        ...(currentTheme === "light"
          ? DEFAULT_LUMINANCE_LIGHT
          : DEFAULT_LUMINANCE_DARK),
      },
    }));
    setChroma((prev) => ({
      ...prev,
      [currentTheme]: {
        ...(currentTheme === "light"
          ? DEFAULT_CHROMA_LIGHT
          : DEFAULT_CHROMA_DARK),
      },
    }));
  }

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[340px] border-l border-neutral-200 dark:border-neutral-800 z-50 p-6 overflow-y-auto shadow-lg flex flex-col gap-6"
      style={{ background: "#222", color: "#fff" }}
    >
      {/* Remover seletor de modo de hue shift */}
      {/* Slider de tolerância até 3x */}
      <div className="mb-4">
        <label className="font-semibold text-xs mr-2">
          Tolerância do clamp:
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={toleranceFactor[currentTheme]}
          onChange={(e) =>
            setToleranceFactor((f) => ({
              ...f,
              [currentTheme]: Number(e.target.value),
            }))
          }
          style={{ width: 120 }}
        />
        <span className="ml-2 text-xs">
          {toleranceFactor[currentTheme].toFixed(2)}x
        </span>
      </div>
      {/* Slider de expoente da curva senoidal: min=0.3, max=3 */}
      <div className="mb-4">
        <label className="font-semibold text-xs mr-2">
          Pico da curva senoidal:
        </label>
        <input
          type="range"
          min={0.3}
          max={3}
          step={0.01}
          value={sineExponent[currentTheme]}
          onChange={(e) =>
            setSineExponent((f) => ({
              ...f,
              [currentTheme]: Number(e.target.value),
            }))
          }
          style={{ width: 120 }}
        />
        <span className="ml-2 text-xs">
          {sineExponent[currentTheme].toFixed(2)}x
        </span>
      </div>
      {/* Remover seletor de modo de hue shift */}
      {/* <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-xs mr-2" htmlFor="hue-shift-mode">
          Modo de Hue Shift:
        </label>
        <select
          id="hue-shift-mode"
          className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-900 text-white"
          value={hueShiftMode[currentTheme]}
          onChange={e => setHueShiftMode(m => ({ ...m, [currentTheme]: e.target.value as HueShiftMode }))}
        >
          <option value="bezold">Bezold-Brücke</option>
          <option value="sigmoid">Curva Sigmóide</option>
          <option value="off">Desligado</option>
        </select>
      </div> */}
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-lg mb-2">Tema</h2>
        {/* Removido: sliders globais de luminância */}
        <div className="flex gap-2 self-end">
          <button
            className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={handleReset}
            aria-label="Restaurar HUEs originais"
          >
            Resetar
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-brand-500 hover:bg-brand-100 dark:hover:bg-brand-800"
            onClick={() => downloadPaletteJson(hues)}
            aria-label="Exportar paleta customizada em JSON"
          >
            Exportar JSON
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-warning-500 hover:bg-warning-100 dark:hover:bg-warning-800"
            onClick={() => {
              // Copia todas as variáveis do tema atual para o oposto
              const from = currentTheme;
              const to = currentTheme === "light" ? "dark" : "light";
              setHues((prev) => ({
                ...prev,
                [to]: { ...prev[from] },
              }));
              setHueShift((prev) => ({
                ...prev,
                [to]: { ...prev[from] },
              }));
              setLuminance((prev) => ({
                ...prev,
                [to]: { ...prev[from] },
              }));
              setChroma((prev) => ({
                ...prev,
                [to]: { ...prev[from] },
              }));
            }}
            aria-label="Copiar para outro tema"
          >
            Copiar para outro tema
          </button>
        </div>
      </div>
      {/* Mostrar apenas o tema atualmente aberto */}
      {[currentTheme].map((mode) => (
        <ColorSection
          key={mode}
          mode={mode as ThemeMode}
          hues={hues}
          onHueChange={handleHueChange}
          hueShift={hueShift}
          onHueShiftChange={handleHueShiftChange}
          luminance={luminance}
          chroma={chroma}
          VARS={VARS}
          currentTheme={currentTheme}
          setLuminance={setLuminance}
          setChroma={setChroma}
          // colorMode={colorMode} // Removed
          // setColorMode={setColorMode} // Removed
        />
      ))}
      {/* Sessão de Bordas */}
      <BordasSection />
    </aside>
  );
}

// === COMPONENTE DE BORDAS CORRIGIDO ===

const STATIC_RADIUS_STEPS = [
  { var: "--radius-none", label: "NONE", value: 0 },
  { var: "--radius-xs", label: "XS", value: 0.125 },
  { var: "--radius-sm", label: "SM", value: 0.25 },
  { var: "--radius-md", label: "MD", value: 0.375 },
  { var: "--radius-lg", label: "LG", value: 0.5 },
  { var: "--radius-xl", label: "XL", value: 0.75 },
  { var: "--radius-2xl", label: "2XL", value: 1 },
  { var: "--radius-3xl", label: "3XL", value: 1.5 },
  { var: "--radius-4xl", label: "4XL", value: 2 },
  { var: "--radius-5xl", label: "5XL", value: 3 },
  { var: "--radius-6xl", label: "6XL", value: 4 },
];

function fetchRadiusSteps(): Promise<
  Array<{ var: string; label: string; value: number }>
> {
  return Promise.resolve(STATIC_RADIUS_STEPS);
}

function BordasSection() {
  // Estado para o brand atual
  const [brand, setBrand] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.getAttribute("data-brand") || "a"
      : "a"
  );

  // Estado para valores originais capturados quando não está no custom
  const [originalValues, setOriginalValues] = useState<Record<string, number>>(
    {}
  );

  // Estado customizado para bordas (apenas para custom)
  const [customBorders, setCustomBorders] = useState(() => {
    const saved = localStorage.getItem("customPaletteBorders");
    if (saved) return JSON.parse(saved);
    // Padrão igual ao tema A
    return {
      "--box-rounded": 7, // índice para --radius-4xl
      "--card-rounded": 4, // índice para --radius-xl
      "--input-rounded": 3, // índice para --radius-lg
      "--button-rounded": 2, // índice para --radius-md
    };
  });

  // Estado para os steps de raio detectados dinamicamente
  const [radiusSteps, setRadiusSteps] = useState<
    Array<{ var: string; label: string; value: number }>
  >([]);

  // Busca os steps do CSS ao montar
  useEffect(() => {
    fetchRadiusSteps().then(setRadiusSteps);
  }, []);

  // Função para capturar valores originais dos temas A e B
  const captureOriginalValues = useCallback(() => {
    if (brand === "custom") return;

    const root = document.documentElement;
    const newOriginals: Record<string, number> = {};

    ROUNDED_VARS.forEach(({ var: cssVar }) => {
      // Remove qualquer valor inline para pegar o valor original do CSS
      root.style.removeProperty(cssVar);

      // Pega o valor computado
      const computedValue = getComputedStyle(root)
        .getPropertyValue(cssVar)
        .trim();

      // Converte para número (assumindo que está em rem)
      const numValue = parseFloat(computedValue.replace("rem", ""));

      // Encontra o índice correspondente no radiusSteps
      const stepIndex = radiusSteps.findIndex(
        (step) => Math.abs(step.value - numValue) < 0.001
      );

      newOriginals[cssVar] = stepIndex >= 0 ? stepIndex : 0;
    });

    setOriginalValues(newOriginals);
  }, [brand, radiusSteps]);

  // Detecta mudanças no brand
  useEffect(() => {
    const handler = () => {
      const newBrand =
        document.documentElement.getAttribute("data-brand") || "a";
      setBrand(newBrand);
    };

    // Listener para mudanças no brand
    window.addEventListener("brandChange", handler);

    // Listener para mudanças no atributo data-brand
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-brand"
        ) {
          handler();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-brand"],
    });

    return () => {
      window.removeEventListener("brandChange", handler);
      observer.disconnect();
    };
  }, []);

  // Captura valores originais quando não está no custom
  useEffect(() => {
    if (brand !== "custom") {
      // Pequeno delay para garantir que os estilos foram aplicados
      setTimeout(() => {
        captureOriginalValues();
      }, 100);
    }
  }, [brand, captureOriginalValues]);

  // Estado para o fator de --input-rounded-sm
  const [inputSmFactor, setInputSmFactor] = useState(() => {
    const saved = localStorage.getItem("customInputRoundedSmFactor");
    return saved ? parseFloat(saved) : 0.5;
  });

  // Salva o fator no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("customInputRoundedSmFactor", String(inputSmFactor));
  }, [inputSmFactor]);

  // Variáveis de fontes customizáveis
  const FONT_VARS = [
    {
      var: "--font-sans",
      label: "Sans",
      defaultValue: '"Nunito Sans", system-ui, -apple-system, sans-serif',
    },
    {
      var: "--font-monos",
      label: "Monospace",
      defaultValue: '"SF Mono", Consolas, monospace',
    },
  ];

  // Estado para as fontes customizadas
  const [customFonts, setCustomFonts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("customPaletteFonts");
    if (saved) return JSON.parse(saved) as Record<string, string>;
    // Valores padrão do tema A
    return {
      "--font-sans": '"Nunito Sans", system-ui, -apple-system, sans-serif',
      "--font-monos": '"SF Mono", Consolas, monospace',
    };
  });

  // Salva fontes customizadas no localStorage
  useEffect(() => {
    localStorage.setItem("customPaletteFonts", JSON.stringify(customFonts));
  }, [customFonts]);

  // Aplica bordas customizadas no DOM apenas quando está no custom
  useEffect(() => {
    const root = document.documentElement;

    if (brand === "custom") {
      // Aplica valores customizados principais
      Object.entries(customBorders).forEach(([cssVar, stepIndex]) => {
        const step = radiusSteps[stepIndex as number];
        if (step) {
          root.style.setProperty(cssVar, `${step.value}rem`);
        }
      });

      // Aplica variáveis derivadas (ex: --input-rounded-sm)
      // Calcula fator de --input-rounded-sm
      const inputRounded =
        root.style.getPropertyValue("--input-rounded") ||
        getComputedStyle(root).getPropertyValue("--input-rounded");
      if (inputRounded) {
        const num = parseFloat(inputRounded.replace("rem", ""));
        if (!isNaN(num)) {
          root.style.setProperty(
            "--input-rounded-sm",
            `${num * inputSmFactor}rem`
          );
        }
      }

      // Aplica variáveis de fonte customizadas
      Object.entries(customFonts).forEach(([cssVar, value]) => {
        root.style.setProperty(cssVar, value);
      });

      // Salva no localStorage
      localStorage.setItem(
        "customPaletteBorders",
        JSON.stringify(customBorders)
      );
    } else {
      // Remove valores inline para usar os valores originais do CSS
      ROUNDED_VARS.forEach(({ var: cssVar }) => {
        root.style.removeProperty(cssVar);
      });
      // Remove também a derivada
      root.style.removeProperty("--input-rounded-sm");
      // Remove variáveis de fonte customizadas
      FONT_VARS.forEach(({ var: cssVar }) => {
        root.style.removeProperty(cssVar);
      });
    }

    // Dispara evento para notificar mudanças de bordas/fontes
    window.dispatchEvent(new CustomEvent("paletteChange"));
  }, [customBorders, brand, radiusSteps, inputSmFactor, customFonts]);

  // Função para obter o valor atual (index do radiusSteps)
  function getCurrentValue(cssVar: string): number {
    if (brand === "custom") {
      return customBorders[cssVar] || 0;
    }
    return originalValues[cssVar] || 0;
  }

  // Handler para mudanças (só funciona no custom)
  function handleChange(cssVar: string, newIndex: number) {
    if (brand !== "custom") return;

    setCustomBorders((prev: Record<string, number>) => ({
      ...prev,
      [cssVar]: newIndex,
    }));
  }

  return (
    <section className="mb-6">
      <h2 className="font-bold text-base mb-2">Bordas</h2>
      <div className="mb-2 text-xs text-neutral-400">
        {brand === "custom"
          ? "Editável"
          : `Tema ${brand.toUpperCase()} (somente leitura)`}
      </div>
      {ROUNDED_VARS.map(({ var: cssVar, label }) => {
        const currentIdx = getCurrentValue(cssVar);
        const currentStep = radiusSteps[currentIdx] || radiusSteps[0];
        const isInput = cssVar === "--input-rounded";
        // Definir max específico para box (6XL = 4rem)
        let maxIdx = radiusSteps.length - 1;
        if (cssVar === "--box-rounded") {
          const idx6xl = radiusSteps.findIndex(
            (s) => s.label === "6XL" || s.value === 4
          );
          if (idx6xl !== -1) maxIdx = idx6xl;
        }
        return (
          <div key={cssVar} className="mb-4">
            <label className="block text-xs mb-1 font-semibold">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={Math.max(0, maxIdx)}
                step={1}
                value={currentIdx}
                disabled={brand !== "custom"}
                onChange={(e) => handleChange(cssVar, Number(e.target.value))}
                className="flex-1 accent-brand-500 disabled:opacity-50"
              />
              <span className="text-xs w-24 text-right">
                {currentStep?.label || "N/A"} (
                {currentStep ? Math.round(currentStep.value * 16) : 0}px)
              </span>
            </div>
            {/* Slider para fator do input-rounded-sm */}
            {isInput && brand === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={inputSmFactor}
                  onChange={(e) => setInputSmFactor(Number(e.target.value))}
                  className="flex-1 accent-brand-500"
                  aria-label="Fator do input-rounded-sm"
                />
                <span className="text-xs w-14 text-right">
                  sm × {inputSmFactor}
                </span>
              </div>
            )}
          </div>
        );
      })}
      {/* Controles de fontes customizadas */}
      {brand === "custom" && (
        <div className="mt-6">
          <h3 className="font-semibold text-base mb-2">Fontes</h3>
          {FONT_VARS.map(({ var: cssVar, label }) => (
            <div key={cssVar} className="mb-3">
              <label className="block text-xs mb-1 font-semibold">
                {label}
              </label>
              <input
                type="text"
                value={customFonts[cssVar] || ""}
                onChange={(e) =>
                  setCustomFonts((f: Record<string, string>) => ({
                    ...f,
                    [cssVar]: e.target.value,
                  }))
                }
                className="w-full px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs"
                placeholder={label}
                aria-label={`Fonte ${label}`}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// === COMPONENTE DE SEÇÃO DE COR ===
interface ColorSectionProps {
  mode: ThemeMode;
  hues: HuesState;
  onHueChange: (mode: ThemeMode, key: ColorKey, value: number) => void;
  hueShift: Record<ThemeMode, Record<ColorKey, number>>;
  onHueShiftChange: (mode: ThemeMode, key: ColorKey, value: number) => void;
  luminance: LuminanceState;
  chroma: ChromaState;
  VARS: Record<ColorKey, string[]>;
  currentTheme: ThemeMode;
  setLuminance: React.Dispatch<React.SetStateAction<LuminanceState>>;
  setChroma: React.Dispatch<React.SetStateAction<ChromaState>>;
  // colorMode: "hard" | "soft"; // Removed
  // setColorMode: React.Dispatch<React.SetStateAction<"hard" | "soft">>; // Removed
}

function ColorSection({
  mode,
  hues,
  onHueChange,
  hueShift,
  onHueShiftChange,
  luminance,
  chroma,
  VARS,
  currentTheme,
  setLuminance,
  setChroma,
}: // colorMode, // Removed
// setColorMode, // Removed
ColorSectionProps) {
  return (
    <div>
      <h2 className="font-bold text-base mb-2">
        {mode === "light" ? "☀️ Light" : "🌑 Dark"}
      </h2>
      {COLOR_SETS.map(({ key, label }) => (
        <section key={key} className="mb-4">
          <h3 className="font-semibold text-base mb-1">{label}</h3>
          <div className="mb-2">
            {/* Slider de HUE - agora primeiro */}
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor={`hue-${mode}-${key}`} className="text-xs w-10">
                HUE
              </label>
              <input
                id={`hue-${mode}-${key}`}
                type="range"
                min={0}
                max={360}
                value={hues[mode][key]}
                onChange={(e) => onHueChange(mode, key, Number(e.target.value))}
                className="flex-1 accent-brand-500"
              />
              <input
                type="number"
                min={0}
                max={360}
                value={hues[mode][key]}
                onChange={(e) => onHueChange(mode, key, Number(e.target.value))}
                className="w-16 px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-right"
                aria-label={`HUE ${
                  mode === "light" ? "Light" : "Dark"
                } ${label}`}
              />
            </div>
            {/* Slider de Hue Shift */}
            <div className="flex items-center gap-2 mb-2">
              <label
                htmlFor={`hue-shift-${mode}-${key}`}
                className="text-xs w-10"
                title="Efeito Bezold-Brücke: cores claras deslocam para azul, cores escuras para vermelho"
              >
                Shift
              </label>
              <input
                id={`hue-shift-${mode}-${key}`}
                type="range"
                min={-50}
                max={50}
                value={hueShift[mode][key]}
                onChange={(e) =>
                  onHueShiftChange(mode, key, Number(e.target.value))
                }
                className="flex-1 accent-brand-500"
                title="Efeito Bezold-Brücke: cores claras deslocam para azul, cores escuras para vermelho"
              />
              <input
                type="number"
                min={-50}
                max={50}
                value={hueShift[mode][key]}
                onChange={(e) =>
                  onHueShiftChange(mode, key, Number(e.target.value))
                }
                className="w-16 px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-right"
                aria-label={`Hue Shift ${
                  mode === "light" ? "Light" : "Dark"
                } ${label}`}
              />
            </div>
            {/* Sliders de Luminância para cada cor */}
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs w-10">mL</label>
                <input
                  type="range"
                  min={0.2}
                  max={0.99}
                  step={0.01}
                  value={luminance[mode][key].mL}
                  onChange={(e) =>
                    setLuminance((prev: LuminanceState) => ({
                      ...prev,
                      [mode]: {
                        ...prev[mode],
                        [key]: {
                          ...prev[mode][key],
                          mL: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className="flex-1 accent-brand-500"
                />
                <span className="text-xs w-10 text-right">
                  {(luminance[mode][key].mL * 100).toFixed(0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs w-10">cL</label>
                <input
                  type="range"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={luminance[mode][key].cL}
                  onChange={(e) =>
                    setLuminance((prev: LuminanceState) => ({
                      ...prev,
                      [mode]: {
                        ...prev[mode],
                        [key]: {
                          ...prev[mode][key],
                          cL: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className="flex-1 accent-brand-500"
                />
                <span className="text-xs w-10 text-right">
                  {(luminance[mode][key].cL * 100).toFixed(0)}
                </span>
              </div>
            </div>
            {/* Sliders de Chroma para cada cor - cC primeiro, depois mC */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs w-10">cC</label>
                <input
                  type="range"
                  min={0}
                  max={0.8}
                  step={0.01}
                  value={chroma[mode][key].cC}
                  onChange={(e) =>
                    setChroma((prev: ChromaState) => ({
                      ...prev,
                      [mode]: {
                        ...prev[mode],
                        [key]: {
                          ...prev[mode][key],
                          cC: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className="flex-1 accent-brand-500"
                />
                <span className="text-xs w-10 text-right">
                  {(chroma[mode][key].cC * 100).toFixed(0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs w-10">mC</label>
                <input
                  type="range"
                  min={0.01}
                  max={0.4}
                  step={0.01}
                  value={chroma[mode][key].mC}
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value > -0.01 && value < 0.01) value = 0.01;
                    setChroma((prev: ChromaState) => ({
                      ...prev,
                      [mode]: {
                        ...prev[mode],
                        [key]: {
                          ...prev[mode][key],
                          mC: value,
                        },
                      },
                    }));
                  }}
                  className="flex-1 accent-brand-500"
                />
                <span className="text-xs w-10 text-right">
                  {(chroma[mode][key].mC * 100).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

// Função utilitária debounce
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
