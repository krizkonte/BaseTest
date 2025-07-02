import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "./BaseSlot";
import { useCallback } from "react";
import { useForceActive } from "../../lib/useForceActive";

function classMerge(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
const buttonVariants = cva(
  "foundation-button interactive font-semibold select-none",
  {
    variants: {
      variant: {
        default: "surface accent",
        outline: "ghost border-1 border-medium",
        ghost: "ghost",

        danger: "surface danger",
        ghostDanger: "ghost danger",

        link: "int-text-link",
      },
      size: {
        default: "h-8 px-3 rounded-sm",
        sm: "h-6 px-2 rounded-sm",
        lg: "h-10.5 px-4.5 rounded-lg",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  [key: string]: any;
}

type BaseButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<typeof Slot> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      onMouseDown,
      onTouchStart,
      ...props
    },
    ref
  ) => {
    // Passa o ref externo para o hook para compor corretamente
    const [btnRef, forceActiveHandlers] = useForceActive<HTMLButtonElement>(
      150,
      ref
    );

    // Handlers combinados para não sobrescrever os do usuário
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        forceActiveHandlers.onMouseDown(e);
        if (onMouseDown) onMouseDown(e);
      },
      [forceActiveHandlers, onMouseDown]
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent<HTMLButtonElement>) => {
        forceActiveHandlers.onTouchStart(e);
        if (onTouchStart) onTouchStart(e);
      },
      [forceActiveHandlers, onTouchStart]
    );

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={btnRef}
        className={classMerge(buttonVariants({ variant, size, className }))}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        {...props}
      />
    );
  }
);
BaseButton.displayName = "BaseButton";

export default BaseButton;
