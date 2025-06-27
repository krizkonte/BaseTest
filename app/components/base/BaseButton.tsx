import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "./BaseSlot";

function classMerge(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
const buttonVariants = cva("foundation-button", {
  variants: {
    variant: {
      default: "int-layer-accent",
      outline: "int-layer-ghost border-medium border-1",
      ghost: "int-layer-ghost",

      destructive: "int-layer-accent-danger",
      destructiveGhost: "int-layer-ghost-danger",

      link: "int-text-link",
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

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  [key: string]: any;
}

type BaseButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<typeof Slot> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={classMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
BaseButton.displayName = "BaseButton";

export { BaseButton };
