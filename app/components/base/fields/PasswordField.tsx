import { Field } from "@base-ui-components/react/field";
import { forwardRef, useState } from "react";
import { Icon } from "../Icon";

export interface PasswordFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled" | "ghost";
  defaultValue?: string;
  showToggle?: boolean;
  onChange?: (value: string) => void;
  validation?: (value: string) => string | undefined;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      name,
      label,
      placeholder,
      required = false,
      description,
      error,
      disabled = false,
      size = "md",
      variant = "outlined",
      defaultValue,
      showToggle = true,
      onChange,
      validation,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Field.Root className="flex w-full flex-col items-start gap-1">
        {label && (
          <Field.Label className="typo caption-1 font-medium">
            {label}
            {required && <span className="text-error">*</span>}
          </Field.Label>
        )}
        <div className="relative w-full">
          <Field.Control
            type={showPassword ? "text" : "password"}
            name={name}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-10 w-full pl-3.5 pr-10 border-thin border-surface input-rounded"
            ref={ref}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="interactive-ghost absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md"
              disabled={disabled}
              tabIndex={-1}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              <Icon icon={showPassword ? "EyeOff" : "Eye"} size="sm" />
            </button>
          )}
        </div>
        {error && (
          <Field.Error className="typo caption-1 text-error">
            {error}
          </Field.Error>
        )}
        {description && (
          <Field.Description className="typo caption-1 text-secondary">
            {description}
          </Field.Description>
        )}
      </Field.Root>
    );
  }
);

PasswordField.displayName = "PasswordField";
