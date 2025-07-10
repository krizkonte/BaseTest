import React from "react";
import { oklch, formatCss, parse } from "culori";

const COLOR_SETS = [
  { key: "neutral", label: "Neutral" },
  { key: "brand", label: "Brand" },
  { key: "danger", label: "Danger" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const;
type ColorKey = (typeof COLOR_SETS)[number]["key"];

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
const ORIGINALS: {
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

  // Atualiza as variáveis CSS no DOM ao mudar HUE ou tema
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
      COLOR_SETS.forEach(({ key }) => {
        VARS[key].forEach((cssVar, idx) => {
          const original = ORIGINALS[modeKey][key][idx];
          const newVal = updateOklchHue(original, hues[modeKey][key]);
          root.style.setProperty(cssVar, newVal);
        });
      });
    });
  }, [hues, currentTheme]);

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
        <button
          className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 self-end"
          onClick={handleReset}
          aria-label="Restaurar HUEs originais"
        >
          Resetar
        </button>
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
              </div>
            </section>
          ))}
        </div>
      ))}
    </aside>
  );
}
