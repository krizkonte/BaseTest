import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "./BaseSlot";

// Função utilitária para combinar classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Variantes do botão usando CVA
const buttonVariants = cva("button-base", {
  variants: {
    variant: {
      default: "bg-interactive-accent text-on-accent",
      destructive: "bg-interactive-accent-danger text-on-accent-danger",
      outline: "bg-interactive-subtle text-on-subtle border-medium border-1 ",
      ghost: "bg-interactive-subtle text-on-subtle",
      link: "text-on-surface-link",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Tipos do componente Button

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  // Permite qualquer prop de elemento, exceto ref
  [key: string]: any;
}

type BaseButtonRef = React.ElementRef<typeof Slot> | HTMLButtonElement;
type BaseButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<typeof Slot> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const BaseButton = React.forwardRef<BaseButtonRef, BaseButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Ref simples e seguro para ambos os casos
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<any>}
        {...props}
      />
    );
  }
);
BaseButton.displayName = "BaseButton";

export { BaseButton, buttonVariants };
