import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui-components/react/merge-props";
import type { LucideIcon } from "lucide-react";
import {
  Eye,
  EyeOff,
  Search,
  Menu,
  Plus,
  Trash2,
  Settings,
  Download,
  Bell,
  // Adicione outros ícones conforme necessário
} from "lucide-react";

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

// Mapeamento de nomes de ícones para componentes
const iconMap: Record<string, LucideIcon> = {
  Eye,
  EyeOff,
  Search,
  Menu,
  Plus,
  Trash2,
  Settings,
  Download,
  Bell,
  // Adicione outros ícones conforme necessário
};

export interface IconProps extends VariantProps<typeof iconVariants> {
  /** Nome do ícone ou componente Lucide React */
  icon: string | LucideIcon;
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
 * - Suporte a uso por nome (string) ou componente direto
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon,
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

    // Resolve o ícone (string ou componente)
    const IconComponent = typeof icon === "string" ? iconMap[icon] : icon;

    if (!IconComponent) {
      console.warn(
        `Ícone "${icon}" não encontrado. Ícones disponíveis:`,
        Object.keys(iconMap)
      );
      return null;
    }

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

// Exporta os ícones individuais para uso direto se necessário
export { Eye, EyeOff, Search, Menu, Plus, Trash2, Settings, Download, Bell };
