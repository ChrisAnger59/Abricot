import StatusBadge from "@/components/Atoms/StatusBadge";
import CalendarIcon from "@/components/Atoms/CalendarIcon";
import TaskActions from "@/components/Molecules/TaskActions";
import TaskComments from "@/components/Molecules/TaskComments";
import UserTag from "@/components/Molecules/UserTag";
import { formatDueDate } from "@/lib/utils";
import type { Task, User } from "@/types/api";

interface TaskCardProps {
    task: Task;
    // People a task can be assigned to (the team of the project), for the edit form
    users: Pick<User, "id" | "name">[];
    // Name of the signed-in user, for the avatar of the comment form
    currentUserName: string;
}

/**
 * Card of one task in the project page: title, status, description, due date,
 * assignees and comments, plus the "…" menu to edit or delete it.
 *
 * Server component: the interactive parts are client components inside it: the menu
 * (TaskActions) and the comment form (inside TaskComments, which unfolds the comments).
 * The title is an <h3>: h1 = project, h2 = "Tâches".
 */
export default function TaskCard({ task, users, currentUserName }: TaskCardProps) {
    return (
        <article className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base font-semibold text-text">{task.title}</h3>
                        <StatusBadge status={task.status} />
                    </div>

                    {task.description && (
                        <p className="text-sm text-text-muted">{task.description}</p>
                    )}
                </div>

                {/* Only the data the edit form needs goes to the client component */}
                <TaskActions
                    projectId={task.projectId}
                    taskId={task.id}
                    task={{
                        title: task.title,
                        description: task.description,
                        dueDate: task.dueDate,
                        status: task.status,
                        assigneeIds: task.assignees.map((assignee) => assignee.user.id),
                    }}
                    users={users}
                />
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

            <TaskComments
                projectId={task.projectId}
                taskId={task.id}
                taskTitle={task.title}
                comments={task.comments}
                currentUserName={currentUserName}
            />
        </article>
    );
}
