"use client";

import { STATUS_STYLES } from "@/components/Atoms/StatusBadge";
import { isTaskStatus } from "@/lib/validation";
import type { TaskStatus } from "@/types/api";

// Statuses offered by the filter, in display order.
// "Annulée" is included: without it, a cancelled task could only be seen with "all statuses".
const FILTER_STATUSES: readonly TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"];

interface StatusFilterProps {
    id: string;
    // Accessible name of the list (not displayed)
    label: string;
    // Selected status, or "" for every status
    value: TaskStatus | "";
    onChange: (status: TaskStatus | "") => void;
}

/**
 * Drop-down list to filter by task status.
 * A native <select>: the keyboard and the screen readers work without any extra code.
 * The labels are the ones of the status badges (StatusBadge), so the words are the same everywhere.
 */
export default function StatusFilter({ id, label, value, onChange }: StatusFilterProps) {
    return (
        <div>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>

            <select
                id={id}
                value={value}
                onChange={(event) => {
                    // The value comes from our own options, but the check also narrows the type for TypeScript
                    const selected = event.target.value;
                    onChange(isTaskStatus(selected) ? selected : "");
                }}
                className="min-h-11 w-full rounded-btn border border-border bg-surface px-4 text-sm text-text sm:w-auto"
            >
                <option value="">Tous les statuts</option>

                {FILTER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                        {STATUS_STYLES[status].label}
                    </option>
                ))}
            </select>
        </div>
    );
}
