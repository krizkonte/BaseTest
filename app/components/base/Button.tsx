import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "../custom/Slot";
import { useForceActive } from "../../lib/useForceActive";
import { classMerge } from "../../lib/classMerge";

/**
 * Variantes do botão usando CVA para melhor DX e organização
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
      default: "h-8 px-3 rounded-md",
      sm: "h-6 px-2 rounded-md",
      lg: "h-10.5 px-4.5 rounded-lg",
      icon: "size-8",
    },
    loading: {
      true: "opacity-70 pointer-events-none",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

type BaseButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<typeof Slot> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Componente Button aprimorado com:
 * - CVA expandido para estados booleanos (disabled, loading, fullWidth)
 * - Acessibilidade simplificada com atributos ARIA automáticos
 * - Suporte a elementos customizados (as prop) com acessibilidade
 * - DX melhorada com menos boilerplate
 */
const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      fullWidth = false,
      disabled = false,
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

    const Comp = asChild ? Slot : as || "button";
    const isButton = Comp === "button";
    const isDisabled = disabled || loading;

    // Atributos de acessibilidade simplificados usando spread condicional
    const accessibilityProps = {
      ...(loading && { "aria-busy": true }),
      ...(!isButton && isDisabled && { "aria-disabled": true }),
      ...(!isButton && { role: "button", tabIndex: 0 }),
      ...(isButton && { disabled: isDisabled }),
    };

    // Handler de teclado apenas para elementos não-button (Enter/Espaço)
    const handleKeyDown = !isButton
      ? (e: React.KeyboardEvent) => {
          if (
            (e.key === "Enter" || e.key === " ") &&
            props.onClick &&
            !isDisabled
          ) {
            e.preventDefault();
            props.onClick(e as any);
          }
        }
      : undefined;

    return (
      <Comp
        ref={btnRef}
        className={classMerge(
          buttonVariants({
            variant,
            size,
            loading,
            fullWidth,
            className,
          })
        )}
        {...forceActiveHandlers}
        onKeyDown={handleKeyDown}
        {...accessibilityProps}
        {...props}
      />
    );
  }
);
BaseButton.displayName = "BaseButton";

export default BaseButton;
