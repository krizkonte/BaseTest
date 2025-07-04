import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui-components/react/merge-props";
import type { LucideIcon } from "lucide-react";

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  /** Ícone do Lucide React */
  icon: LucideIcon;
  /** Tamanho customizado (sobrescreve size) */
  customSize?: number;
  /** Cor customizada */
  color?: string;
  /** Espessura do stroke */
  strokeWidth?: number;
  /** Usar stroke width absoluto */
  absoluteStrokeWidth?: boolean;
  className?: string;
}

/**
 * Componente de ícone Lucide React padronizado e reutilizável
 * - Tamanhos predefinidos (sm, default, lg, xl)
 * - Acessível por padrão (aria-hidden)
 * - Compatível com o sistema de design
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size,
      customSize,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      className,
      ...props
    },
    ref
  ) => {
    const merged = mergeProps(
      { className: iconVariants({ size }) },
      { className },
      props
    );

    // Props do Lucide
    const lucideProps = {
      size:
        customSize ||
        (size === "sm" ? 16 : size === "lg" ? 24 : size === "xl" ? 32 : 20),
      color,
      strokeWidth,
      absoluteStrokeWidth,
      "aria-hidden": true,
    };

    return <IconComponent ref={ref} {...merged} {...lucideProps} />;
  }
);

Icon.displayName = "Icon";
