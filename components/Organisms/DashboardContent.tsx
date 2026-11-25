import { apiFetch } from "@/lib/api";
import {
    filterTasks,
    getCurrentMonth,
    isInMonth,
    moveCancelledTasksLast,
    parseDashboardView,
    parseTaskFilters,
    sortTasksByPriority,
    type SearchParams,
} from "@/lib/utils";
import Alert from "@/components/Atoms/Alert";
import ViewTabs from "@/components/Molecules/ViewTabs";
import AssignedTaskList from "@/components/Organisms/AssignedTaskList";
import KanbanBoard from "@/components/Organisms/KanbanBoard";
import type { AssignedTasksData } from "@/types/api";

interface DashboardContentProps {
    // Query string of the URL (?view=...&query=...&status=...), a promise like `params`
    searchParams: Promise<SearchParams>;
}

/**
 * Content of the dashboard: the view tabs and the tasks assigned to the signed-in user,
 * as a list or as a Kanban board of the month.
 *
 * Awaits `searchParams` itself: the page passes it down without awaiting it, so this component is
 * covered by the Suspense boundary of the page. The tabs are here (not in the page) because the
 * active one depends on the URL.
 *
 * NOTE: GET /dashboard/assigned-tasks only returns the tasks where the user is assigned, and
 * ignores any filter. The API sorts by priority alphabetically (HIGH, LOW, MEDIUM, URGENT), so
 * the order is rebuilt here. Everything else (search, month) is also done here.
 */
export default async function DashboardContent({ searchParams }: DashboardContentProps) {
    const params = await searchParams;
    // Invalid values in the URL simply mean "list view" and "no filter"
    const view = parseDashboardView(params);
    const result = await apiFetch<AssignedTasksData>("/dashboard/assigned-tasks");

    let content;

    if (!result.success) {
        content = <Alert>Impossible de récupérer vos tâches. Réessayez plus tard.</Alert>;
    } else if (view === "kanban") {
        // Kanban: tasks due this month, cancelled ones left out. A task without due date is in no month.
        // The search and status filters belong to the list view only (not on the mockup of the board).
        const month = getCurrentMonth();
        const monthTasks = result.data.tasks.filter(
            (task) => isInMonth(task.dueDate, month) && task.status !== "CANCELLED"
        );

        content = <KanbanBoard tasks={sortTasksByPriority(monthTasks)} month={month} />;
    } else {
        const filters = parseTaskFilters(params);
        const allTasks = result.data.tasks;

        content = (
            <AssignedTaskList
                tasks={moveCancelledTasksLast(sortTasksByPriority(filterTasks(allTasks, filters)))}
                totalCount={allTasks.length}
                hasActiveFilters={filters.query !== "" || filters.status !== null}
            />
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <ViewTabs activeView={view} />
            {content}
        </div>
    );
}
