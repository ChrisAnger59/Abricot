import { STATUS_STYLES } from "@/components/Atoms/StatusBadge";
import { TASK_FORM_STATUSES } from "@/lib/validation";
import type { TaskStatus } from "@/types/api";

interface StatusPickerProps {
    // Status checked at first (the form uses "TODO")
    defaultValue: TaskStatus;
    // Error message, displayed under the group
    error?: string;
}

/**
 * Choice of a task status: native radio buttons displayed as the colored pills of the mockup.
 *
 * - <fieldset> + <legend> give the group its accessible name; the arrow keys move between options.
 * - The radio itself is visually hidden (`sr-only`) but stays focusable; the pill shows the focus
 *   ring (`has-focus-visible`) and the choice: a thick border AND a check mark, never color alone.
 * - The submitted field is named "status".
 */
export default function StatusPicker({ defaultValue, error }: StatusPickerProps) {
    return (
        <fieldset
            aria-describedby={error ? "status-error" : undefined}
            className="flex flex-col gap-2"
        >
            <legend className="mb-2 text-sm">Statut :</legend>

            <div className="flex flex-wrap gap-2">
                {TASK_FORM_STATUSES.map((status) => (
                    <label
                        key={status}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-transparent px-4 text-sm has-checked:border-dark has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-dark ${STATUS_STYLES[status].className}`}
                    >
                        <input
                            type="radio"
                            name="status"
                            value={status}
                            defaultChecked={status === defaultValue}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="hidden peer-checked:inline">✓</span>
                        {STATUS_STYLES[status].label}
                    </label>
                ))}
            </div>

            {error && (
                <p id="status-error" className="text-sm text-todo-text">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
