import { Suspense } from "react";
import AssignedTaskCard from "@/components/Molecules/AssignedTaskCard";
import TaskFilters from "@/components/Organisms/TaskFilters";
import type { AssignedTask } from "@/types/api";

interface AssignedTaskListProps {
    // Tasks to display: already filtered and sorted by the parent
    tasks: AssignedTask[];
    // Number of tasks assigned to the user before filtering, to tell "none" from "no match"
    totalCount: number;
    // True when a search or a status filter is active
    hasActiveFilters: boolean;
}

/**
 * "Mes tâches assignées" panel of the dashboard: title, filters and task cards.
 *
 * Filtering and sorting are done by the parent (DashboardContent); this component only displays.
 * The filters are the same component as the project page: they write the URL, which is read on
 * the server (the API does not filter).
 */
export default function AssignedTaskList({ tasks, totalCount, hasActiveFilters }: AssignedTaskListProps) {
    // Read by screen readers when it changes. It is always in the page (even empty): a live region
    // must exist before its text changes to be announced. The search text is never repeated here.
    let resultMessage = "";
    if (hasActiveFilters) {
        resultMessage = tasks.length === 0
            ? "Aucune tâche ne correspond à votre recherche."
            : `${tasks.length} ${tasks.length > 1 ? "tâches affichées" : "tâche affichée"}.`;
    }

    return (
        <section className="flex flex-col gap-6 rounded-card border border-border bg-surface p-4 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-lg font-semibold text-text">Mes tâches assignées</h2>
                    <p className="text-text-muted">Par ordre de priorité</p>
                </div>

                {/* useSearchParams (in TaskFilters) reads the URL of the request: it needs a Suspense boundary */}
                <Suspense fallback={<div aria-hidden="true" className="min-h-11 w-full sm:w-96" />}>
                    <TaskFilters />
                </Suspense>
            </div>

            <p role="status" className="sr-only">{resultMessage}</p>

            {totalCount === 0 ? (
                <p className="text-text-muted">Aucune tâche assignée pour l&apos;instant.</p>
            ) : tasks.length === 0 ? (
                <p className="text-text-muted">
                    Aucune tâche ne correspond à votre recherche. Modifiez ou réinitialisez les filtres.
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <AssignedTaskCard task={task} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
