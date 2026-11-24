import CalendarIcon from "@/components/Atoms/CalendarIcon";
import ListIcon from "@/components/Atoms/ListIcon";
import TaskCard from "@/components/Molecules/TaskCard";
import { sortTasksByPriority } from "@/lib/utils";
import type { Task, User } from "@/types/api";

interface TaskListProps {
    tasks: Task[];
    // People a task can be assigned to (the team of the project), passed on to each card
    users: Pick<User, "id" | "name">[];
}

/**
 * "Tâches" section of the project page: header with the view tabs, then the task cards
 * sorted by priority.
 *
 * NOTE: the "Calendrier" view is not implemented (bonus feature, out of scope):
 * its tab is displayed as in the mockup but disabled.
 * The tabs are not role="tablist": there are no panels to switch between.
 */
export default function TaskList({ tasks, users }: TaskListProps) {
    const sortedTasks = sortTasksByPriority(tasks);

    return (
        <section className="flex flex-col gap-6 rounded-card border border-border bg-surface p-4 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-lg font-semibold text-text">Tâches</h2>
                    <p className="text-text-muted">Par ordre de priorité</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        aria-current="true"
                        className="flex min-h-11 items-center gap-2 rounded-btn bg-primary-light px-4 text-sm text-primary-text"
                    >
                        <ListIcon className="size-4" />
                        Liste
                    </span>

                    <button
                        type="button"
                        disabled
                        className="flex min-h-11 items-center gap-2 rounded-btn px-4 text-sm text-text-muted disabled:cursor-not-allowed"
                    >
                        <CalendarIcon className="size-4" />
                        Calendrier
                    </button>
                </div>
            </div>

            {sortedTasks.length === 0 ? (
                <p className="text-text-muted">Aucune tâche pour l&apos;instant.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {sortedTasks.map((task) => (
                        <li key={task.id}>
                            <TaskCard task={task} users={users} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
