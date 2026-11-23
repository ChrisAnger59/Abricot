import type { TaskStatus } from "@/types/api";

const STATUS_STYLES: Record<TaskStatus, { label: string, className: string }> = {
    TODO: { label: "À faire", className: "bg-todo-bg text-todo-text" },
    IN_PROGRESS: { label: "En cours", className: "bg-progress-bg text-progress-text" },
    DONE: { label: "Terminée", className: "bg-done-bg text-done-text" },
    CANCELLED: { label: "Annulée", className: "bg-tag text-text-on-tint" }
};

interface StatusBadgeProps {
    status: TaskStatus;
}

/**
 * Colored pill showing a task status.
 * The status is always written in full: color is never the only carrier of information.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
    const { label, className } = STATUS_STYLES[status];

    return (
        <span className={`rounded-full px-4 py-1 text-sm ${className}`}>
            {label}
        </span>
    );
}
