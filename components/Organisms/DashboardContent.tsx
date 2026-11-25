import { apiFetch } from "@/lib/api";
import {
    filterTasks,
    moveCancelledTasksLast,
    parseTaskFilters,
    sortTasksByPriority,
    type SearchParams,
} from "@/lib/utils";
import Alert from "@/components/Atoms/Alert";
import AssignedTaskList from "@/components/Organisms/AssignedTaskList";
import type { AssignedTasksData } from "@/types/api";

interface DashboardContentProps {
    // Query string of the URL (?query=...&status=...), a promise like `params`
    searchParams: Promise<SearchParams>;
}

/**
 * Content of the dashboard: the tasks assigned to the signed-in user.
 *
 * Awaits `searchParams` itself: the page passes it down without awaiting it, so this component is
 * covered by the Suspense boundary of the page.
 *
 * NOTE: GET /dashboard/assigned-tasks only returns the tasks where the user is assigned, and
 * ignores any filter. The API sorts by priority alphabetically (HIGH, LOW, MEDIUM, URGENT), so
 * the order is rebuilt here: filter, then sort by priority, then cancelled tasks last.
 */
export default async function DashboardContent({ searchParams }: DashboardContentProps) {
    // Invalid values in the URL simply mean "no filter"
    const filters = parseTaskFilters(await searchParams);
    const result = await apiFetch<AssignedTasksData>("/dashboard/assigned-tasks");

    if (!result.success) {
        return <Alert>Impossible de récupérer vos tâches. Réessayez plus tard.</Alert>;
    }

    const allTasks = result.data.tasks;
    const visibleTasks = moveCancelledTasksLast(sortTasksByPriority(filterTasks(allTasks, filters)));

    return (
        <AssignedTaskList
            tasks={visibleTasks}
            totalCount={allTasks.length}
            hasActiveFilters={filters.query !== "" || filters.status !== null}
        />
    );
}
