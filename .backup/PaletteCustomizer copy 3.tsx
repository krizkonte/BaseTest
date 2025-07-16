import React from "react";
import { oklch, formatCss, parse } from "culori";
import { downloadPaletteJson } from "../app/components/JsonExporter";

const COLOR_SETS = [
  { key: "neutral", label: "Neutral" },
  { key: "brand", label: "Brand" },
  { key: "danger", label: "Danger" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const;
export type ColorKey = (typeof COLOR_SETS)[number]["key"];

type HuesState = {
  light: Record<ColorKey, number>;
  dark: Record<ColorKey, number>;
};

const DEFAULT_HUES: HuesState = {
  light: {
    neutral: 180,
    brand: 171,
    danger: 28,
    warning: 71,
    success: 145,
    info: 232,
  },
  dark: {
    neutral: 180,
    brand: 171,
    danger: 28,
    warning: 71,
    success: 145,
    info: 232,
  },
};

// Função utilitária para atualizar o HUE de uma string OKLCH
function updateOklchHue(oklchStr: string, newHue: number) {
  const parsed = parse(oklchStr);
  if (!parsed || parsed.mode !== "oklch") return oklchStr;
  return formatCss({
    l: parsed.l,
    c: parsed.c,
    h: newHue,
    mode: "oklch",
  });
}

// Função utilitária para gerar steps de luminância com curva linear y = mx + c
function generateLinearLuminanceSteps({
  m,
  c,
  steps,
}: {
  m: number;
  c: number;
  steps: number;
}): number[] {
  // Gera steps do mais claro (x=1) para o mais escuro (x=0)
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const x = 1 - i / (steps - 1); // Inverte: começa do mais claro para o mais escuro
    arr.push(c + (m - c) * x);
  }
  return arr;
}

// Função utilitária para gerar steps de chroma com curva senoidal (máximo no centro)
function generateSineChromaSteps({
  min,
  max,
  steps,
}: {
  min: number;
  max: number;
  steps: number;
}): number[] {
  const arr: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    // Senoidal: máximo no centro, mínimo nas pontas
    const chroma = min + (max - min) * Math.sin(Math.PI * t);
    arr.push(chroma);
  }
  return arr;
}

// Função para gerar um array mapeado de steps com luminância, chroma e HUE usando culori.oklch
function mapLuminanceChromaAndHue({
  mL,
  cL,
  mC,
  cC,
  steps,
  hue,
}: {
  mL: number;
  cL: number;
  mC: number;
  cC: number;
  steps: number;
  hue: number;
}): Array<{ l: number; c: number; h: number; css: string }> {
  const luminances = generateLinearLuminanceSteps({ m: mL, c: cL, steps });
  // Limitar o chroma máximo permitido para o hue selecionado
  const chromaMax = Math.min(cC, getMaxChromaForHue(hue));
  // Usar curva senoidal para chroma, respeitando o limite
  const chromas = generateSineChromaSteps({ min: mC, max: chromaMax, steps });
  return luminances.map((l, i) => {
    const c = chromas[i];
    const h = hue;
    const color = oklch({ l, c, h, mode: "oklch" });
    return { l, c, h, css: formatCss(color) || "" };
  });
}

// Função utilitária para limitar o chroma máximo permitido para cada hue (OKLCH)
function getMaxChromaForHue(hue: number): number {
  // Valores aproximados para OKLCH (pode ser refinado conforme necessidade)
  if (hue >= 20 && hue <= 40) return 0.23; // vermelho/laranja
  if (hue >= 60 && hue <= 100) return 0.35; // amarelo/verde
  if (hue >= 120 && hue <= 160) return 0.32; // verde
  if (hue >= 200 && hue <= 260) return 0.25; // azul
  return 0.2; // padrão conservador para outros casos
}

// Mapeamento das variáveis para cada conjunto
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

// Valores originais do CSS custom (copiados do arquivo)
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

export function PaletteCustomizer() {
  // Estado dos HUEs
  const [hues, setHues] = React.useState(() => {
    const saved = localStorage.getItem("customPaletteHues");
    if (saved) return JSON.parse(saved);
    return DEFAULT_HUES;
  });

  // Luminância agora é por cor e por tema
  type LuminanceParams = { mL: number; cL: number };
  type LuminanceState = {
    light: Record<ColorKey, LuminanceParams>;
    dark: Record<ColorKey, LuminanceParams>;
  };
  const defaultLuminance: LuminanceParams = { mL: 0.1, cL: 0.04 };
  const [luminance, setLuminance] = React.useState<LuminanceState>(() => {
    const saved = localStorage.getItem("customPaletteLuminance");
    if (saved) return JSON.parse(saved);
    return {
      light: Object.fromEntries(
        COLOR_SETS.map(({ key }) => [key, { ...defaultLuminance }])
      ) as Record<ColorKey, LuminanceParams>,
      dark: Object.fromEntries(
        COLOR_SETS.map(({ key }) => [key, { ...defaultLuminance }])
      ) as Record<ColorKey, LuminanceParams>,
    };
  });

  // Salva luminância customizada no localStorage
  React.useEffect(() => {
    localStorage.setItem("customPaletteLuminance", JSON.stringify(luminance));
  }, [luminance]);

  // Chroma agora é por cor e por tema
  type ChromaParams = { mC: number; cC: number };
  type ChromaState = {
    light: Record<ColorKey, ChromaParams>;
    dark: Record<ColorKey, ChromaParams>;
  };
  const defaultChroma: ChromaParams = { mC: 0.1, cC: 0.04 };
  const [chroma, setChroma] = React.useState<ChromaState>(() => {
    const saved = localStorage.getItem("customPaletteChroma");
    if (saved) return JSON.parse(saved);
    return {
      light: Object.fromEntries(
        COLOR_SETS.map(({ key }) => [key, { ...defaultChroma }])
      ) as Record<ColorKey, ChromaParams>,
      dark: Object.fromEntries(
        COLOR_SETS.map(({ key }) => [key, { ...defaultChroma }])
      ) as Record<ColorKey, ChromaParams>,
    };
  });

  // Salva chroma customizado no localStorage
  React.useEffect(() => {
    localStorage.setItem("customPaletteChroma", JSON.stringify(chroma));
  }, [chroma]);

  // Atualiza localStorage sempre que mudar
  React.useEffect(() => {
    localStorage.setItem("customPaletteHues", JSON.stringify(hues));
  }, [hues]);

  // Estado do tema atual (light/dark) para detectar mudanças
  const [currentTheme, setCurrentTheme] = React.useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  // Observa mudanças na classe do html para detectar troca de tema
  React.useEffect(() => {
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

  // Atualiza as variáveis CSS no DOM ao mudar HUE, luminância ou chroma custom
  React.useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-brand") !== "custom") return;
    ["light", "dark"].forEach((mode) => {
      const modeKey = mode as "light" | "dark";
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
        const steps = VARS[key].length;
        const palette = mapLuminanceChromaAndHue({
          mL: lum.mL,
          cL: lum.cL,
          mC: chr.mC,
          cC: chr.cC,
          steps,
          hue,
        });
        VARS[key].forEach((cssVar, idx) => {
          root.style.setProperty(cssVar, palette[idx].css);
        });
      });
    });

    // Dispara evento para notificar mudanças de cor
    window.dispatchEvent(new CustomEvent("paletteChange"));
  }, [hues, luminance, chroma, currentTheme]);

  // Limpa variáveis customizadas ao sair da brand custom
  React.useEffect(() => {
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
  function handleHueChange(
    mode: "light" | "dark",
    key: ColorKey,
    value: number
  ) {
    setHues((prev: HuesState) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: value,
      },
    }));
  }

  // Função para resetar os HUEs para o padrão
  function handleReset() {
    setHues(DEFAULT_HUES);
  }

  // Luminância separada para light e dark
  const [mLLight, setMLLight] = React.useState(0.1); // Inclinação luminância light
  const [cLLight, setCLLight] = React.useState(0.04); // Intercepto luminância light
  const [mLDark, setMLDark] = React.useState(0.1); // Inclinação luminância dark
  const [cLDark, setCLDark] = React.useState(0.04); // Intercepto luminância dark

  // Estado do tema (light/dark)
  const [theme, setTheme] = React.useState<"light" | "dark">(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  // Sincroniza tema com classe do html
  React.useEffect(() => {
    const handler = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };
    window.addEventListener("brandChange", handler);
    window.addEventListener("storage", handler);
    window.addEventListener("themeChange", handler);
    return () => {
      window.removeEventListener("brandChange", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("themeChange", handler);
    };
  }, []);

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[340px] border-l border-neutral-200 dark:border-neutral-800 z-50 p-6 overflow-y-auto shadow-lg flex flex-col gap-6"
      style={{ background: "#222", color: "#fff" }}
    >
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
        </div>
      </div>
      {["light", "dark"].map((mode) => (
        <div key={mode} className="mb-6">
          <h2 className="font-bold text-base mb-2">
            {mode === "light" ? "☀️ Light" : "🌑 Dark"}
          </h2>
          {COLOR_SETS.map(({ key, label }) => (
            <section key={key} className="mb-4">
              <h3 className="font-semibold text-base mb-1">{label}</h3>
              <div className="mb-2">
                {/* Sliders de Luminância para cada cor */}
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-10">mL</label>
                    <input
                      type="range"
                      min={0.8}
                      max={0.98}
                      step={0.01}
                      value={
                        luminance[mode as "light" | "dark"][key as ColorKey].mL
                      }
                      onChange={(e) =>
                        setLuminance((prev: LuminanceState) => ({
                          ...prev,
                          [mode]: {
                            ...prev[mode as "light" | "dark"],
                            [key]: {
                              ...prev[mode as "light" | "dark"][
                                key as ColorKey
                              ],
                              mL: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="flex-1 accent-brand-500"
                    />
                    <span className="text-xs w-10 text-right">
                      {luminance[mode as "light" | "dark"][
                        key as ColorKey
                      ].mL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-10">cL</label>
                    <input
                      type="range"
                      min={0}
                      max={0.2}
                      step={0.01}
                      value={
                        luminance[mode as "light" | "dark"][key as ColorKey].cL
                      }
                      onChange={(e) =>
                        setLuminance((prev: LuminanceState) => ({
                          ...prev,
                          [mode]: {
                            ...prev[mode as "light" | "dark"],
                            [key]: {
                              ...prev[mode as "light" | "dark"][
                                key as ColorKey
                              ],
                              cL: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="flex-1 accent-brand-500"
                    />
                    <span className="text-xs w-10 text-right">
                      {luminance[mode as "light" | "dark"][
                        key as ColorKey
                      ].cL.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Slider de HUE */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`hue-${mode}-${key}`}
                    className="text-xs w-10"
                  >
                    HUE
                  </label>
                  <input
                    id={`hue-${mode}-${key}`}
                    type="range"
                    min={0}
                    max={360}
                    value={hues[mode][key]}
                    onChange={(e) =>
                      handleHueChange(
                        mode as "light" | "dark",
                        key,
                        Number(e.target.value)
                      )
                    }
                    className="flex-1 accent-brand-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={hues[mode][key]}
                    onChange={(e) =>
                      handleHueChange(
                        mode as "light" | "dark",
                        key,
                        Number(e.target.value)
                      )
                    }
                    className="w-16 px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-right"
                    aria-label={`HUE ${
                      mode === "light" ? "Light" : "Dark"
                    } ${label}`}
                  />
                </div>
                {/* Sliders de Chroma para cada cor */}
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-10">mC</label>
                    <input
                      type="range"
                      min={-0.5}
                      max={0.5}
                      step={0.01}
                      value={
                        chroma[mode as "light" | "dark"][key as ColorKey].mC
                      }
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value > -0.01 && value < 0.01) value = 0;
                        setChroma((prev: ChromaState) => ({
                          ...prev,
                          [mode]: {
                            ...prev[mode as "light" | "dark"],
                            [key]: {
                              ...prev[mode as "light" | "dark"][
                                key as ColorKey
                              ],
                              mC: value,
                            },
                          },
                        }));
                      }}
                      className="flex-1 accent-brand-500"
                    />
                    <span className="text-xs w-10 text-right">
                      {chroma[mode as "light" | "dark"][
                        key as ColorKey
                      ].mC.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-10">cC</label>
                    <input
                      type="range"
                      min={0}
                      max={getMaxChromaForHue(hues[mode][key])}
                      step={0.01}
                      value={
                        chroma[mode as "light" | "dark"][key as ColorKey].cC
                      }
                      onChange={(e) =>
                        setChroma((prev: ChromaState) => ({
                          ...prev,
                          [mode]: {
                            ...prev[mode as "light" | "dark"],
                            [key]: {
                              ...prev[mode as "light" | "dark"][
                                key as ColorKey
                              ],
                              cC: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="flex-1 accent-brand-500"
                    />
                    <span className="text-xs w-10 text-right">
                      {chroma[mode as "light" | "dark"][
                        key as ColorKey
                      ].cC.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      ))}
      {/* Sessão de Bordas */}
      <BordasSection />
    </aside>
  );
}

// --- COMPONENTE DE BORDAS CORRIGIDO ---

// Função para detectar automaticamente todas as variáveis --radius-* do CSS lendo o arquivo primitives.css
async function fetchRadiusSteps(): Promise<
  Array<{ var: string; label: string; value: number }>
> {
  try {
    const res = await fetch("/app/styles/primitives.css");
    const css = await res.text();
    // Regex para pegar todas as linhas do tipo --radius-nome: valor;
    const regex = /--radius-([\w-]+):\s*([\d.]+)(rem|px);/g;
    const steps: Array<{ var: string; label: string; value: number }> = [];
    let match;
    while ((match = regex.exec(css)) !== null) {
      const name = match[1];
      const value = parseFloat(match[2]);
      const unit = match[3];
      if (!isNaN(value)) {
        steps.push({
          var: `--radius-${name}`,
          label: name.toUpperCase(),
          value: unit === "px" ? value / 16 : value, // converte px para rem se necessário
        });
      }
    }
    // Ordena por valor crescente
    return steps.sort((a, b) => a.value - b.value);
  } catch (e) {
    return [];
  }
}

const ROUNDED_VARS = [
  { var: "--box-rounded", label: "Box" },
  { var: "--card-rounded", label: "Card" },
  { var: "--input-rounded", label: "Input" },
  { var: "--button-rounded", label: "Button" },
];

function BordasSection() {
  // Estado para o brand atual
  const [brand, setBrand] = React.useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.getAttribute("data-brand") || "a"
      : "a"
  );

  // Estado para valores originais capturados quando não está no custom
  const [originalValues, setOriginalValues] = React.useState<
    Record<string, number>
  >({});

  // Estado customizado para bordas (apenas para custom)
  const [customBorders, setCustomBorders] = React.useState(() => {
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
  const [radiusSteps, setRadiusSteps] = React.useState<
    Array<{ var: string; label: string; value: number }>
  >([]);

  // Busca os steps do CSS ao montar
  React.useEffect(() => {
    fetchRadiusSteps().then(setRadiusSteps);
  }, []);

  // Função para capturar valores originais dos temas A e B
  const captureOriginalValues = React.useCallback(() => {
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
  React.useEffect(() => {
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

  // Atualiza radiusSteps quando o CSS muda (opcional: pode remover se não quiser hot reload)
  // React.useEffect(() => {
  //   const updateRadiusSteps = () => {
  //     fetchRadiusSteps().then(setRadiusSteps);
  //   };
  //   updateRadiusSteps();
  //   const observer = new MutationObserver(updateRadiusSteps);
  //   observer.observe(document.head, {
  //     childList: true,
  //     subtree: true,
  //   });
  //   return () => observer.disconnect();
  // }, []);

  // Captura valores originais quando não está no custom
  React.useEffect(() => {
    if (brand !== "custom") {
      // Pequeno delay para garantir que os estilos foram aplicados
      setTimeout(() => {
        captureOriginalValues();
      }, 100);
    }
  }, [brand, captureOriginalValues]);

  // Estado para o fator de --input-rounded-sm
  const [inputSmFactor, setInputSmFactor] = React.useState(() => {
    const saved = localStorage.getItem("customInputRoundedSmFactor");
    return saved ? parseFloat(saved) : 0.5;
  });

  // Salva o fator no localStorage sempre que mudar
  React.useEffect(() => {
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
  const [customFonts, setCustomFonts] = React.useState<Record<string, string>>(
    () => {
      const saved = localStorage.getItem("customPaletteFonts");
      if (saved) return JSON.parse(saved) as Record<string, string>;
      // Valores padrão do tema A
      return {
        "--font-sans": '"Nunito Sans", system-ui, -apple-system, sans-serif',
        "--font-monos": '"SF Mono", Consolas, monospace',
      };
    }
  );

  // Salva fontes customizadas no localStorage
  React.useEffect(() => {
    localStorage.setItem("customPaletteFonts", JSON.stringify(customFonts));
  }, [customFonts]);

  // Aplica bordas customizadas no DOM apenas quando está no custom
  React.useEffect(() => {
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
              <span className="text-xs w-20 text-right">
                {currentStep?.label || "N/A"} ({currentStep?.value || 0}rem)
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
