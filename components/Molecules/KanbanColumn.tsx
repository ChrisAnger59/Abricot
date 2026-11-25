import AssignedTaskCard from "@/components/Molecules/AssignedTaskCard";
import type { AssignedTask } from "@/types/api";

interface KanbanColumnProps {
    // Title of the column, e.g. "À faire"
    title: string;
    // Tasks of this column, already sorted
    tasks: AssignedTask[];
}

/**
 * One column of the Kanban board: title, number of tasks and the task cards.
 *
 * The title is an <h3> (h2 = month of the board). The number is written, and a screen reader
 * reads "4 tâches" after the title, so it does not depend on the grey bubble.
 */
export default function KanbanColumn({ title, tasks }: KanbanColumnProps) {
    return (
        <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-text">
                {title}
                <span className="rounded-full bg-tag px-2 py-0.5 text-sm font-normal text-text-on-tint">
                    <span aria-hidden="true">{tasks.length}</span>
                    <span className="sr-only">{tasks.length} {tasks.length > 1 ? "tâches" : "tâche"}</span>
                </span>
            </h3>

            {tasks.length === 0 ? (
                <p className="text-sm text-text-muted">Aucune tâche</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <AssignedTaskCard task={task} layout="column" />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
