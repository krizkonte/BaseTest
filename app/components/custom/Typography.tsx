import * as React from "react";
import { Slot } from "./Slot";

// Mapeamento das variantes para as classes CSS
const TYPO_VARIANTS = {
  "heading-1": "heading-1",
  "heading-2": "heading-2",
  "tittle-1": "tittle-1",
  "tittle-2": "tittle-2",
  "body-1": "body-1",
  "body-2": "body-2",
  "caption-1": "caption-1",
  "caption-2": "caption-2",
} as const;

type TypoVariant = keyof typeof TYPO_VARIANTS;

// Mapeamento de elemento padrão para cada variante
const DEFAULT_ELEMENT: Record<TypoVariant, React.ElementType> = {
  "heading-1": "h1",
  "heading-2": "h2",
  "tittle-1": "h3",
  "tittle-2": "h4",
  "body-1": "p",
  "body-2": "p",
  "caption-1": "span",
  "caption-2": "span",
};

const COLOR_CLASSES = {
  default: undefined,
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  disabled: "text-disabled",
  success: "text-success",
  error: "text-error",
  info: "text-info",
  warning: "text-warning",
  link: "text-link",
};

type Color = keyof typeof COLOR_CLASSES;

const WEIGHT_CLASSES = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
  light: "font-light",
};

type Weight = keyof typeof WEIGHT_CLASSES;

type Status = "success" | "error" | "info" | "warning";

const STATUS_PRESETS: Record<
  Status,
  { color: Color; weight: Weight; aria: Record<string, string> }
> = {
  success: {
    color: "success",
    weight: "semibold",
    aria: { "aria-live": "polite" },
  },
  error: { color: "error", weight: "semibold", aria: { role: "alert" } },
  info: { color: "info", weight: "semibold", aria: { "aria-live": "polite" } },
  warning: { color: "warning", weight: "semibold", aria: { role: "alert" } },
};

type TypographyProps = {
  variant: TypoVariant;
  color?: Color;
  weight?: Weight;
  status?: Status;
  asChild?: boolean;
  as?: React.ElementType;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className">;

/**
 * Componente de tipografia customizada, semântico, acessível e padronizado.
 * - Usa o elemento HTML adequado por padrão (h1, h2, p, etc) conforme a variante.
 * - Permite sobrescrever o elemento via prop 'as'.
 * - Suporta slot via 'asChild'.
 * - Props color, weight e status para padronizar cor, peso e acessibilidade.
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    { variant, color, weight, status, asChild = false, as, children, ...props },
    ref
  ) => {
    let colorClass = color ? COLOR_CLASSES[color] : undefined;
    let weightClass = weight ? WEIGHT_CLASSES[weight] : undefined;
    let ariaProps: Record<string, string> = {};

    if (status) {
      colorClass = COLOR_CLASSES[STATUS_PRESETS[status].color];
      weightClass = WEIGHT_CLASSES[STATUS_PRESETS[status].weight];
      ariaProps = STATUS_PRESETS[status].aria;
    }

    const Comp = asChild ? Slot : as || DEFAULT_ELEMENT[variant];
    const classes = ["typo", TYPO_VARIANTS[variant], colorClass, weightClass]
      .filter(Boolean)
      .join(" ");

    return (
      <Comp ref={ref} className={classes} {...ariaProps} {...props}>
        {children}
      </Comp>
    );
  }
);

Typography.displayName = "Typography";
