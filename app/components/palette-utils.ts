import { formatHex } from "culori";

export interface PaletteParams {
  baseHue: number;
  steps: number;
  customLightnessSteps?: number[];
  customChromaSteps?: number[];
  customHueShiftSteps?: number[];
}

export interface PaletteColor {
  oklch: string;
  hex: string;
}

function lerp(from: number, to: number, t: number): number {
  if (t <= 0) return from;
  if (t >= 1) return to;
  return from + (to - from) * t;
}

const k1 = 0.206;
const k2 = 0.03;
const k3 = (1 + k1) / (1 + k2);

function betterToe(l: number): number {
  return (
    0.5 *
    (k3 * l - k1 + Math.sqrt((k3 * l - k1) * (k3 * l - k1) + 4 * k2 * k3 * l))
  );
}

function betterToeInv(l: number): number {
  return (l * l + k1 * l) / (k3 * (l + k2));
}

export function generatePalette(params: PaletteParams): PaletteColor[] {
  const {
    baseHue,
    steps,
    customLightnessSteps,
    customChromaSteps,
    customHueShiftSteps,
  } = params;

  const palette: PaletteColor[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);

    let lightness: number;
    if (customLightnessSteps && customLightnessSteps.length > 0) {
      const stepIndex = Math.floor(t * (customLightnessSteps.length - 1));
      const clampedIndex = Math.min(stepIndex, customLightnessSteps.length - 1);
      lightness = customLightnessSteps[clampedIndex];
    } else {
      lightness = lerp(0.99, 0.15, t);
    }

    let chroma: number;
    if (customChromaSteps && customChromaSteps.length > 0) {
      const stepIndex = Math.floor(t * (customChromaSteps.length - 1));
      const clampedIndex = Math.min(stepIndex, customChromaSteps.length - 1);
      chroma = customChromaSteps[clampedIndex];
    } else {
      const chromaT = Math.sin(t * Math.PI);
      chroma = lerp(0.001, 0.5, chromaT);
    }

    let hue: number;
    if (customHueShiftSteps && customHueShiftSteps.length > 0) {
      const stepIndex = Math.floor(t * (customHueShiftSteps.length - 1));
      const clampedIndex = Math.min(stepIndex, customHueShiftSteps.length - 1);
      const hueShift = customHueShiftSteps[clampedIndex];
      hue = (((baseHue + hueShift) % 360) + 360) % 360;
    } else {
      hue = baseHue;
    }

    const labLightness = betterToe(lightness);
    const oklchColor = {
      l: labLightness,
      c: chroma,
      h: hue,
    };
    const finalLightness = betterToeInv(labLightness);
    const oklchString = `oklch(${(finalLightness * 100).toFixed(1)}% ${(
      oklchColor.c * 100
    ).toFixed(1)}% ${hue.toFixed(1)})`;
    const hexValue = formatHex(oklchString);
    palette.push({
      oklch: oklchString,
      hex: hexValue || "#000000",
    });
  }

  return palette;
}

export interface ExportParams {
  palette: PaletteColor[];
  name: string;
  mode: "light" | "dark";
  stepNames: string[];
}

export function exportToCSS(params: ExportParams): string {
  const { palette, name, stepNames } = params;

  if (palette.length !== stepNames.length) {
    console.error(
      "O tamanho da paleta e o número de nomes de steps não correspondem."
    );
    return "";
  }

  const variables = exportToCSSVariables(params);
  return `/* ${name} */\n:root {\n${variables}\n}`;
}

export function exportToCSSVariables(params: ExportParams): string {
  const { palette, name, mode, stepNames } = params;

  if (palette.length !== stepNames.length) {
    console.error(
      "O tamanho da paleta e o número de nomes de steps não correspondem."
    );
    return "";
  }

  const suffix = mode === "dark" ? "-dark" : "";
  const formattedName = name.replace(/\s+/g, "-").toLowerCase();

  let css = "";
  palette.forEach((color, index) => {
    const step = stepNames[index];
    const tokenName = `--${formattedName}-${step}${suffix}`;
    css += `  ${tokenName}: ${color.oklch};\n`;
  });

  return css.trimEnd();
}
