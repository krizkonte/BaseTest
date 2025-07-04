import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui-components/react/merge-props";

const loaderVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
    spacing: {
      left: "ml-2",
      right: "mr-2",
      none: "m-0",
      default: "mx-2",
    },
  },
  defaultVariants: {
    size: "default",
    spacing: "default",
  },
});

export interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string;
  [key: string]: any;
}

/**
 * Componente de loader SVG otimizado e reutilizável
 * - Animações CSS para melhor performance
 * - Tamanhos predefinidos
 * - Opções de espaçamento
 * - Acessível por padrão
 */
export const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ size, spacing, className, ...props }, ref) => {
    const merged = mergeProps(
      { className: loaderVariants({ size, spacing }) },
      { className },
      props
    );
    return (
      <svg
        ref={ref}
        {...merged}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }
);

Loader.displayName = "Loader";
