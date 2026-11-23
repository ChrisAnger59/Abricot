import StatusBadge from "@/components/Atoms/StatusBadge";
import CalendarIcon from "@/components/Atoms/CalendarIcon";
import UserTag from "@/components/Molecules/UserTag";
import { formatDueDate } from "@/lib/utils";
import type { Task } from "@/types/api";

interface TaskCardProps {
    task: Task;
}

/**
 * Card of one task in the project page: title, status, description, due date,
 * assignees and number of comments.
 *
 * Server component: nothing here is interactive yet (the actions menu and the
 * comments toggle come with their own features).
 * The title is an <h3>: h1 = project, h2 = "Tâches".
 */
export default function TaskCard({ task }: TaskCardProps) {
    const commentCount = task.comments.length;

    return (
        <article className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-semibold text-text">{task.title}</h3>
                    <StatusBadge status={task.status} />
                </div>

                {task.description && (
                    <p className="text-sm text-text-muted">{task.description}</p>
                )}
            </div>

            <div className="flex flex-col gap-3 text-xs text-text-muted">
                {task.dueDate && (
                    <p className="flex items-center gap-1">
                        Échéance :
                        <CalendarIcon className="size-4" />
                        {/* dateTime keeps the full machine-readable date, the text only shows day and month */}
                        <time dateTime={task.dueDate} className="text-text">
                            {formatDueDate(task.dueDate)}
                        </time>
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    <p>Assigné à :</p>

                    {task.assignees.length === 0 ? (
                        <p>Non assignée</p>
                    ) : (
                        <ul aria-label="Personnes assignées" className="flex flex-wrap items-center gap-2">
                            {task.assignees.map((assignee) => (
                                <li key={assignee.id}>
                                    <UserTag name={assignee.user.name} label={assignee.user.name} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <p className="border-t border-border pt-4 text-sm text-text">
                Commentaires ({commentCount})
            </p>
        </article>
    );
}
