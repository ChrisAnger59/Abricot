import { Suspense } from "react";
import CalendarIcon from "@/components/Atoms/CalendarIcon";
import ListIcon from "@/components/Atoms/ListIcon";
import TaskCard from "@/components/Molecules/TaskCard";
import TaskFilters from "@/components/Organisms/TaskFilters";
import { filterTasks, sortTasksByPriority, type TaskFilters as TaskFiltersValues } from "@/lib/utils";
import type { Task, User } from "@/types/api";

interface TaskListProps {
    tasks: Task[];
    // People a task can be assigned to (the team of the project), passed on to each card
    users: Pick<User, "id" | "name">[];
    // Filters read from the URL by the page (search text and status)
    filters: TaskFiltersValues;
    // Name of the signed-in user, passed on to each card for the avatar of the comment form
    currentUserName: string;
}

/**
 * "Tâches" section of the project page: header with the view tabs and the filters, then the
 * task cards, filtered then sorted by priority.
 *
 * The filtering is done here, on the server, from the URL: the API does not filter tasks
 * (it ignores any query parameter), so all the tasks of the project are fetched and the list is
 * narrowed before being displayed.
 *
 * NOTE: the "Calendrier" view is not implemented (bonus feature, out of scope):
 * its tab is displayed as in the mockup but disabled.
 * The tabs are not role="tablist": there are no panels to switch between.
 */
export default function TaskList({ tasks, users, filters, currentUserName }: TaskListProps) {
    const visibleTasks = sortTasksByPriority(filterTasks(tasks, filters));
    const hasActiveFilters = filters.query !== "" || filters.status !== null;

    // Read by screen readers when it changes. It is always in the page (even empty): a live region
    // must exist before its text changes to be announced. The search text is never repeated here.
    let resultMessage = "";
    if (hasActiveFilters) {
        resultMessage = visibleTasks.length === 0
            ? "Aucune tâche ne correspond à votre recherche."
            : `${visibleTasks.length} ${visibleTasks.length > 1 ? "tâches affichées" : "tâche affichée"}.`;
    }

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

                    {/* useSearchParams (in TaskFilters) reads the URL of the request: it needs a Suspense boundary */}
                    <Suspense fallback={<div aria-hidden="true" className="min-h-11 w-full sm:w-96" />}>
                        <TaskFilters />
                    </Suspense>
                </div>
            </div>

            <p role="status" className="sr-only">{resultMessage}</p>

            {tasks.length === 0 ? (
                <p className="text-text-muted">Aucune tâche pour l&apos;instant.</p>
            ) : visibleTasks.length === 0 ? (
                <p className="text-text-muted">
                    Aucune tâche ne correspond à votre recherche. Modifiez ou réinitialisez les filtres.
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {visibleTasks.map((task) => (
                        <li key={task.id}>
                            <TaskCard task={task} users={users} currentUserName={currentUserName} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
