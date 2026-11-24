import type { ComponentProps } from "react";

interface TextAreaFieldProps extends ComponentProps<"textarea"> {
    id: string;
    label: string;
    error?: string;
    // Shows a visible asterisk and sets aria-required (see FormField)
    required?: boolean;
    // Hides the label visually (it is still read by screen readers): for a field whose
    // placeholder is the visible text, like the comment field
    hideLabel?: boolean;
}

/**
 * Multi-line equivalent of FormField: label, textarea and error message linked together.
 */
export default function TextAreaField({ id, label, error, required, hideLabel, ...textAreaProps }: TextAreaFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className={hideLabel ? "sr-only" : "text-sm"}>
                {label}
                {required && <span aria-hidden="true"> *</span>}
            </label>

            <textarea
                id={id}
                aria-required={required ? true : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted"
                {...textAreaProps}
            />

            {error && (
                <p id={errorId} className="text-sm text-todo-text">
                    {error}
                </p>
            )}
        </div>
    );
}
