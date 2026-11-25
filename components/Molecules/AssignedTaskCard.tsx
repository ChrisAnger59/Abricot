import Link from "next/link";
import StatusBadge from "@/components/Atoms/StatusBadge";
import CalendarIcon from "@/components/Atoms/CalendarIcon";
import CommentIcon from "@/components/Atoms/CommentIcon";
import FolderIcon from "@/components/Atoms/FolderIcon";
import { formatDueDate } from "@/lib/utils";
import type { AssignedTask } from "@/types/api";

/**
 * Disposition of the card:
 * - "row": wide card of the list view (status and button on the right);
 * - "column": narrow card of a Kanban column (everything stacked, button at the bottom).
 */
export type AssignedTaskCardLayout = "row" | "column";

interface AssignedTaskCardProps {
    task: AssignedTask;
    layout?: AssignedTaskCardLayout;
}

/**
 * Card of a task assigned to the user, on the dashboard: title, status, description, project,
 * due date, number of comments and a link to the project.
 *
 * Lighter than TaskCard (project page): no menu, no comment form. The dashboard only lets the
 * user spot a task and go to its project, where it can be edited.
 * The title is an <h3> in the list (h1 = page, h2 = "Mes tâches assignées") and an <h4> in the
 * Kanban board (h2 = month, h3 = column).
 */
export default function AssignedTaskCard({ task, layout = "row" }: AssignedTaskCardProps) {
    const commentCount = task.comments.length;
    const commentLabel = `${commentCount} ${commentCount > 1 ? "commentaires" : "commentaire"}`;
    const isColumn = layout === "column";
    // A capitalized variable holding a tag name can be used as a JSX element
    const Title = isColumn ? "h4" : "h3";

    const description = task.description && (
        <p className="text-sm text-text-muted">{task.description}</p>
    );

    // The icons are decorative: each item is also written in words (sr-only or visible)
    const details = (
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <li className="flex items-center gap-1">
                <FolderIcon className="size-4" />
                <span className="sr-only">Projet :</span>
                {task.project.name}
            </li>

            {task.dueDate && (
                <li className="flex items-center gap-1 border-l border-border pl-3">
                    <CalendarIcon className="size-4" />
                    <span className="sr-only">Échéance :</span>
                    {/* dateTime keeps the full machine-readable date, the text only shows day and month */}
                    <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
                </li>
            )}

            <li className="flex items-center gap-1 border-l border-border pl-3">
                <CommentIcon className="size-4" />
                <span aria-hidden="true">{commentCount}</span>
                <span className="sr-only">{commentLabel}</span>
            </li>
        </ul>
    );

    // The accessible name starts with the visible text ("Voir") and says which task it is about
    const projectLink = (
        <Link
            href={`/projects/${task.projectId}`}
            aria-label={`Voir le projet ${task.project.name}, tâche ${task.title}`}
            className="flex min-h-11 items-center rounded-btn bg-dark px-6 text-sm text-white"
        >
            Voir
        </Link>
    );

    if (isColumn) {
        return (
            <article className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Title className="font-heading text-base font-semibold text-text">{task.title}</Title>
                    <StatusBadge status={task.status} />
                </div>

                {description}
                {details}

                <div className="mt-1 self-start">{projectLink}</div>
            </article>
        );
    }

    return (
        <article className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:flex-row sm:items-stretch sm:justify-between sm:p-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Title className="font-heading text-base font-semibold text-text">{task.title}</Title>
                    {description}
                </div>

                {details}
            </div>

            {/* flex-wrap: on a very narrow screen the button goes under the badge instead of overflowing the card */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-col sm:flex-nowrap sm:items-end">
                <StatusBadge status={task.status} />
                {projectLink}
            </div>
        </article>
    );
}
