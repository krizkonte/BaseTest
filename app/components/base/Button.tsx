import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader } from "../custom/Loader";
import { Icon } from "../custom/Icon";
import { useForceActive } from "../../lib/useForceActive";
import { useRender } from "@base-ui-components/react/use-render";
import { mergeProps } from "@base-ui-components/react/merge-props";
import type { LucideIcon } from "lucide-react";

/**
 * Variantes do botão usando CVA
 * - variant: Estilo visual do botão
 *   - default: Surface brand (padrão)
 *   - outline: Ghost com borda
 *   - ghost: Transparente
 *   - danger: Surface danger
 *   - ghostDanger: Ghost danger
 * - size: Tamanho do botão
 * - loading: Estado de carregamento (opacity + pointer-events)
 * - fullWidth: Largura completa
 * - disabled: Usa pseudo-estado :disabled nativo (mais semântico)
 * - iconOnly: Apenas ícone (sem texto)
 * - hasIcon: Ajusta padding quando há ícone à esquerda (pl-1)
 */
const buttonVariants = cva("foundation-button interactive font-semibold", {
  variants: {
    variant: {
      default: "surface brand",
      outline: "ghost border-surface border-thin",
      ghost: "ghost",
      danger: "surface danger",
      ghostDanger: "ghost danger",
    },
    size: {
      md: "h-8 px-3 rounded-md",
      sm: "h-6 px-2 rounded-md",
      lg: "h-10.5 px-4.5 rounded-lg",
      icon: "size-8",
    },
    loading: {
      true: "opacity-80 pointer-events-none pl-1",
    },
    fullWidth: {
      true: "w-full",
    },
    iconOnly: {
      true: "p-0",
    },
    hasIcon: {
      sm: "pl-1",
      default: "pl-2",
      lg: "pl-3",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  render?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Ícone do Lucide React (apenas à esquerda do texto) */
  icon?: LucideIcon;
  /** Apenas ícone (sem texto) */
  iconOnly?: boolean;
  [key: string]: any;
}

type BaseButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<typeof Loader> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Componente Button aprimorado com:
 * - CVA expandido para estados booleanos (disabled, loading, fullWidth, iconOnly)
 * - Suporte a ícones Lucide React via componente Icon
 * - Acessibilidade simplificada com atributos ARIA automáticos
 * - Suporte a elementos customizados (as prop) com acessibilidade
 * - DX melhorada com menos boilerplate
 */
const BaseButton = React.memo(
  React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    (
      {
        className,
        variant,
        size,
        render,
        loading = false,
        fullWidth = false,
        disabled = false,
        icon,
        iconOnly = false,
        onMouseDown,
        as,
        ...props
      },
      ref
    ) => {
      // Passa o ref externo e handlers para o hook compor automaticamente
      const [btnRef, forceActiveHandlers] = useForceActive<HTMLButtonElement>(
        150,
        ref,
        onMouseDown ? { onMouseDown } : undefined
      );

      // Definir elemento padrão
      const DefaultElement = as || "button";
      const isButton = DefaultElement === "button";
      const isDisabled = disabled || loading;

      // Mapear size do botão para size do ícone
      const getIconSize = React.useMemo(() => {
        switch (size) {
          case "sm":
            return "sm";
          case "lg":
            return "lg";
          case "icon":
            return "default";
          default:
            return "default";
        }
      }, [size]);

      // Defina o gap dinâmico conforme o tamanho do botão
      const gapBySize = {
        sm: "gap-x-1",
        default: "gap-x-2",
        lg: "gap-x-3",
        icon: "",
      };
      const gapClass = gapBySize[size as keyof typeof gapBySize] || "gap-x-2";

      // Atributos de acessibilidade memoizados
      const accessibilityProps = React.useMemo(
        () => ({
          ...(loading && { "aria-busy": true }),
          ...(!isButton && isDisabled && { "aria-disabled": true }),
          ...(!isButton && { role: "button", tabIndex: 0 }),
          ...(isButton && { disabled: isDisabled }),
          ...(iconOnly &&
            icon && { "aria-label": props["aria-label"] || "Botão com ícone" }),
        }),
        [loading, isButton, isDisabled, iconOnly, icon, props["aria-label"]]
      );

      // Handler de teclado otimizado com useCallback
      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
          if (
            !isButton &&
            (e.key === "Enter" || e.key === " ") &&
            props.onClick &&
            !isDisabled
          ) {
            e.preventDefault();
            props.onClick(e as any);
          }
        },
        [isButton, props.onClick, isDisabled]
      );

      // Classe CSS memorizada
      const buttonClassName = React.useMemo(
        () =>
          buttonVariants({
            variant,
            size,
            loading,
            fullWidth,
            iconOnly,
            hasIcon: !loading && icon && !iconOnly ? size : "false",
            className,
          }),
        [variant, size, loading, fullWidth, iconOnly, icon, className]
      );

      // Extraia children de props antes do merge
      const { children, ...restProps } = props;

      // Conteúdo do botão: Loader + Icon + children
      let buttonChildren;
      if (iconOnly) {
        buttonChildren = loading ? (
          <Loader size="default" aria-hidden="true" />
        ) : (
          icon && <Icon icon={icon} size={getIconSize} />
        );
      } else {
        buttonChildren = (
          <span className={`flex items-center ${gapClass}`}>
            {loading && <Loader size="default" aria-hidden="true" />}
            {!loading && icon && <Icon icon={icon} size={getIconSize} />}
            {children}
          </span>
        );
      }

      // Props padrão do botão
      const defaultProps = {
        ref: btnRef,
        className: buttonClassName,
        onKeyDown: handleKeyDown,
        ...accessibilityProps,
        ...forceActiveHandlers,
        children: buttonChildren,
      };

      const element = useRender({
        render: render || <DefaultElement />,
        props: mergeProps(defaultProps, restProps),
      });

      return element;
    }
  )
);
BaseButton.displayName = "BaseButton";

export default BaseButton;
