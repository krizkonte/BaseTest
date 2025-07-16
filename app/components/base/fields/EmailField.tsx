import { Field } from "@base-ui-components/react/field";
import { forwardRef, useState } from "react";

export interface EmailFieldProps {
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
  validateOnBlur?: boolean;
  onChange?: (value: string) => void;
  validation?: (value: string) => string | undefined;
}

export const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(
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
      validateOnBlur = false,
      onChange,
      validation,
      ...props
    },
    ref
  ) => {
    const [validationError, setValidationError] = useState<string | undefined>(
      error
    );

    const validateEmail = (email: string): string | undefined => {
      if (!email) return undefined;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Digite um email válido";
      }
      return undefined;
    };

    const handleChange = (value: string) => {
      if (validateOnBlur) {
        setValidationError(validateEmail(value));
      }
      onChange?.(value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur) {
        setValidationError(validateEmail(e.target.value));
      }
    };

    const displayError = validationError || error;

    return (
      <Field.Root className="flex w-full flex-col items-start gap-1">
        {label && (
          <Field.Label className="typo caption-1 font-medium">
            {label}
            {required && <span className="text-error">*</span>}
          </Field.Label>
        )}
        <Field.Control
          type="email"
          name={name}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className="h-10 w-full pl-3.5 border-thin border-surface input-rounded"
          ref={ref}
          {...props}
        />
        {displayError && (
          <Field.Error className="typo caption-1 text-error">
            {displayError}
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

EmailField.displayName = "EmailField";
