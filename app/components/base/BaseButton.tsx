import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "./BaseSlot";

function classMerge(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
const buttonVariants = cva("foundation-button interactive font-semibold", {
  variants: {
    variant: {
      default: "surface-accent",
      outline: "ghost border-1 border-medium",
      ghost: "ghost",

      danger: "surface-danger",
      ghostDanger: "ghost-danger text-error",

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

export default BaseButton;
