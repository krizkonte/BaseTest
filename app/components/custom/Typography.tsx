import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useRender } from "@base-ui-components/react/use-render";
import { mergeProps } from "@base-ui-components/react/merge-props";

// Mapeamento de elemento padrão para cada variante
const DEFAULT_ELEMENT = {
  "heading-1": "h1",
  "heading-2": "h2",
  "title-1": "h3",
  "title-2": "h4",
  "body-1": "p",
  "body-2": "p",
  "caption-1": "span",
  "caption-2": "span",
} as const;

const typographyVariants = cva("typo", {
  variants: {
    variant: {
      "heading-1": "heading-1",
      "heading-2": "heading-2",
      "title-1": "title-1",
      "title-2": "title-2",
      "body-1": "body-1",
      "body-2": "body-2",
      "caption-1": "caption-1",
      "caption-2": "caption-2",
    },
    color: {
      default: "",
      secondary: "text-secondary",
      tertiary: "text-tertiary",
      disabled: "text-disabled",
      success: "text-success",
      error: "text-error",
      info: "text-info",
      warning: "text-warning",
      link: "text-link",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
      light: "font-light",
    },
  },
  defaultVariants: {
    variant: "body-1",
    color: "default",
    weight: "regular",
  },
});

type Status = "success" | "error" | "info" | "warning";

const STATUS_PRESETS: Record<
  Status,
  {
    color: VariantProps<typeof typographyVariants>["color"];
    weight: VariantProps<typeof typographyVariants>["weight"];
    aria: Record<string, string>;
  }
> = {
  success: {
    color: "success",
    weight: "semibold",
    aria: { "aria-live": "polite" },
  },
  error: {
    color: "error",
    weight: "semibold",
    aria: { role: "alert", "aria-live": "assertive" },
  },
  info: {
    color: "info",
    weight: "semibold",
    aria: { "aria-live": "polite" },
  },
  warning: {
    color: "warning",
    weight: "semibold",
    aria: { role: "alert", "aria-live": "assertive" },
  },
};

type TypographyProps = VariantProps<typeof typographyVariants> & {
  status?: Status;
  render?:
    | React.ReactElement
    | ((props: any, state?: any) => React.ReactElement);
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className">;

/**
 * Componente de tipografia customizada, semântico, acessível e padronizado.
 * - Usa CVA para melhor performance e DX
 * - Usa o elemento HTML adequado por padrão (h1, h2, p, etc) conforme a variante.
 * - Permite sobrescrever o elemento via prop 'as'.
 * - Props color, weight e status para padronizar cor, peso e acessibilidade.
 * - Melhor acessibilidade com aria-level e role apropriados.
 */
export const Typography = React.memo(
  React.forwardRef<HTMLElement, TypographyProps>(
    (
      {
        variant,
        color,
        weight,
        status,
        render,
        as,
        children,
        className,
        ...props
      },
      ref
    ) => {
      // Aplica presets de status se fornecido
      const finalColor = status ? STATUS_PRESETS[status].color : color;
      const finalWeight = status ? STATUS_PRESETS[status].weight : weight;
      const ariaProps = status ? STATUS_PRESETS[status].aria : {};

      const DefaultElement = as || DEFAULT_ELEMENT[variant || "body-1"];
      const isHeading = variant?.startsWith("heading");
      const isTitle = variant?.startsWith("title");
      const isCaption = variant === "caption-1" || variant === "caption-2";
      const isNonSemantic = !render && !as && isCaption;

      // Atributos de acessibilidade essenciais
      const accessibilityProps = {
        ...ariaProps,
        ...(isHeading &&
          render && { "aria-level": variant === "heading-1" ? 1 : 2 }),
        ...(isTitle &&
          render && { "aria-level": variant === "title-1" ? 3 : 4 }),
        ...(isNonSemantic && { role: "text" }),
      };

      const typographyClassName = typographyVariants({
        variant,
        color: finalColor,
        weight: finalWeight,
        className,
      });

      const defaultProps = {
        ref,
        className: typographyClassName,
        ...accessibilityProps,
      };

      let renderProp = render;
      if (typeof render === "function") {
        const fn = render;
        renderProp = (props: any, state?: any) => {
          const result = fn(props, state);
          return result ?? React.createElement(DefaultElement, props);
        };
      }
      const element = useRender({
        render: renderProp ?? React.createElement(DefaultElement),
        props: mergeProps(defaultProps, { ...props, children }),
      });

      return element;
    }
  )
);

Typography.displayName = "Typography";
