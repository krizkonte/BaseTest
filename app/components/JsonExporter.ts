import { VARS, ORIGINALS } from "./PaletteCustomizer";
import type { ColorKey } from "./PaletteCustomizer";
import { parse, oklch as culoriOklch, converter, type Oklch } from "culori";

// Utilitário para gerar IDs únicos simples
function makeId(prefix: string | number, idx: number) {
  return `VariableID:${prefix}:${idx}`;
}

// Utilitário para converter OKLCH para RGBA
const oklchToRgb = converter("rgb");

// Função utilitária para limitar valores entre 0 e 1
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Função para gerar o JSON de exportação das cores customizadas no formato solicitado
export function exportCustomPalette(
  hues: Record<"light" | "dark", Record<ColorKey, number>>
) {
  // Mapeamento dos modos
  const modes = { "3:1": "light", "3:2": "dark" };
  // Lista de variáveis
  const variables: any[] = [];
  const variableIds: string[] = [];
  let idx = 4; // Começa do 4 para seguir o exemplo do usuário

  (Object.keys(VARS) as ColorKey[]).forEach((key) => {
    VARS[key].forEach((cssVar, i) => {
      const id = makeId("3", idx);
      variableIds.push(id);
      // Nome no padrão core/brand-50, core/neutral-100, etc
      const name = `core/${cssVar.replace(/^--/, "")}`;
      // Para cada modo, gera o valor OKLCH customizado e converte para RGBA
      const valuesByMode: any = {};
      const resolvedValuesByMode: any = {};
      ["light", "dark"].forEach((mode, modeIdx) => {
        const original = ORIGINALS[mode as "light" | "dark"][key][i];
        const parsed = parse(original);
        if (!parsed || parsed.mode !== "oklch") return;
        const newHue = hues[mode as "light" | "dark"][key];
        const oklchObj: Oklch = {
          l: parsed.l,
          c: parsed.c,
          h: newHue,
          mode: "oklch",
        };
        // Para cada modo (light/dark), converte OKLCH para RGB e faz clamp
        const rgbLight = oklchToRgb({
          l: parsed.l,
          c: parsed.c,
          h: hues.light[key],
          mode: "oklch",
        });
        const rgbDark = oklchToRgb({
          l: parsed.l,
          c: parsed.c,
          h: hues.dark[key],
          mode: "oklch",
        });
        // Clamp dos valores
        const safeRgbLight = {
          r: clamp01(rgbLight.r ?? 0),
          g: clamp01(rgbLight.g ?? 0),
          b: clamp01(rgbLight.b ?? 0),
          a: clamp01(rgbLight.alpha ?? 1),
        };
        const safeRgbDark = {
          r: clamp01(rgbDark.r ?? 0),
          g: clamp01(rgbDark.g ?? 0),
          b: clamp01(rgbDark.b ?? 0),
          a: clamp01(rgbDark.alpha ?? 1),
        };
        valuesByMode[`3:${modeIdx + 1}`] = {
          r: safeRgbLight.r,
          g: safeRgbLight.g,
          b: safeRgbLight.b,
          a: safeRgbLight.a,
        };
        resolvedValuesByMode[`3:${modeIdx + 1}`] = {
          resolvedValue: {
            r: safeRgbLight.r,
            g: safeRgbLight.g,
            b: safeRgbLight.b,
            a: safeRgbLight.a,
          },
          alias: null,
        };
      });
      variables.push({
        id,
        name,
        description: "",
        type: "COLOR",
        valuesByMode,
        resolvedValuesByMode,
        scopes: ["ALL_SCOPES"],
        hiddenFromPublishing: false,
        codeSyntax: {},
      });
      idx++;
    });
  });

  return {
    id: "VariableCollectionId:3:3",
    name: "Colors",
    modes,
    variableIds,
    variables,
  };
}

export function downloadPaletteJson(
  hues: Record<"light" | "dark", Record<ColorKey, number>>
) {
  const data = exportCustomPalette(hues);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "custom-palette.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
