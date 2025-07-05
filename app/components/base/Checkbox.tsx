import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { mergeProps } from "@base-ui-components/react/merge-props";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { Check } from "lucide-react";

type CheckboxProps = {
  render?: React.ReactElement | ((props: any) => React.ReactElement);
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & Omit<React.ComponentProps<typeof BaseCheckbox.Root>, "className">;

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { className, render, as, children, label, disabled = false, ...props },
    ref
  ) => {
    const DefaultElement = as || "label";

    const defaultProps = {
      ref,
      className: "flex items-center gap-1.5 cursor-pointer select-none",
      children: (
        <>
          <BaseCheckbox.Root
            disabled={disabled}
            className="ghost interactive border-surface border-thin flex size-4 items-center justify-center rounded-sm"
            {...props}
          >
            <BaseCheckbox.Indicator className="flex data-[unchecked]:hidden">
              <Check className="size-3" strokeWidth={3} />
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
          {label && (
            <span
              className={`typo caption-1 ${
                disabled ? "text-disabled cursor-not-allowed" : "text-secondary"
              }`}
            >
              {label}
            </span>
          )}
          {children}
        </>
      ),
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
