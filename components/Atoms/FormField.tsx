import type { ComponentProps } from "react";

interface FormFieldProps extends ComponentProps<"input"> {
    id: string;
    label: string;
    error?: string;
}

function FormField({ id, label, error, ...inputProps } : FormFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm">
                {label}
            </label>

            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-sm"
                {...inputProps}
            />

            {error && (
                <p id={errorId} className="text-sm text-todo-text">
                {error}
                </p>
            )}
        </div>
    );
}

export default FormField;