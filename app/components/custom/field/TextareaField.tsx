import { Field } from "@base-ui-components/react/field";
import { forwardRef } from "react";

export interface TextareaFieldProps {
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
  rows?: number;
  onChange?: (value: string) => void;
  validation?: (value: string) => string | undefined;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
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
      rows = 3,
      onChange,
      validation,
      ...props
    },
    ref
  ) => {
    return (
      <Field.Root className="flex w-full flex-col items-start gap-1">
        {label && (
          <Field.Label className="typo caption-1 font-medium">
            {label}
            {required && <span className="text-error">*</span>}
          </Field.Label>
        )}
        <textarea
          name={name}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={rows}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md pl-3.5 pt-3 border-thin border-surface resize-vertical"
          ref={ref}
          {...props}
        />
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

TextareaField.displayName = "TextareaField";
