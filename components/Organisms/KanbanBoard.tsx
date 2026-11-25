import KanbanColumn from "@/components/Molecules/KanbanColumn";
import { getMonthLabel } from "@/lib/utils";
import type { AssignedTask, TaskStatus } from "@/types/api";

// The columns, in display order. CANCELLED has no column: it is neither on the mockup nor in the specs.
const KANBAN_COLUMNS: { status: TaskStatus; title: string }[] = [
    { status: "TODO", title: "À faire" },
    { status: "IN_PROGRESS", title: "En cours" },
    { status: "DONE", title: "Terminées" },
];

interface KanbanBoardProps {
    // Tasks to display: already limited to the month, without cancelled ones, and sorted by priority
    tasks: AssignedTask[];
    // Month of the board as "YYYY-MM", written above the columns
    month: string;
}

/**
 * Kanban board of the dashboard: the tasks of the month assigned to the user, one column per status.
 *
 * The month is written above the columns: the mockup does not show it, but without it a user
 * could not tell why a task is missing. Three columns side by side from 1024 px, stacked below
 * (no horizontal scrolling area to reach with the keyboard).
 */
export default function KanbanBoard({ tasks, month }: KanbanBoardProps) {
    return (
        <section className="flex flex-col gap-6">
            <h2 className="font-heading text-lg font-semibold text-text">
                Mes tâches de {getMonthLabel(month)}
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {KANBAN_COLUMNS.map((column) => (
                    <KanbanColumn
                        key={column.status}
                        title={column.title}
                        // `filter` keeps the tasks of this status; the order of `tasks` (priority) is kept
                        tasks={tasks.filter((task) => task.status === column.status)}
                    />
                ))}
            </div>
        </section>
    );
}
