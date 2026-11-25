import Link from "next/link";
import CalendarIcon from "@/components/Atoms/CalendarIcon";
import ListIcon from "@/components/Atoms/ListIcon";
import type { DashboardView } from "@/lib/utils";

interface ViewTabsProps {
    // The view currently displayed
    activeView: DashboardView;
}

const TAB_BASE_CLASSES = "flex min-h-11 items-center gap-2 rounded-btn px-4 text-sm";
const ACTIVE_TAB_CLASSES = "bg-primary-light text-primary-text";
const INACTIVE_TAB_CLASSES = "bg-surface text-primary-text hover:bg-primary-light";

/**
 * "Liste" / "Kanban" tabs of the dashboard, as on the mockup.
 *
 * They are links to the URL of each view (/dashboard and /dashboard?view=kanban): the view is
 * rendered by the server and can be shared. The current one has aria-current="page".
 * Not role="tablist": there are no panels to switch between, the whole page changes.
 */
export default function ViewTabs({ activeView }: ViewTabsProps) {
    return (
        <nav aria-label="Vue du tableau de bord" className="flex flex-wrap items-center gap-2">
            <Link
                href="/dashboard"
                aria-current={activeView === "list" ? "page" : undefined}
                className={`${TAB_BASE_CLASSES} ${activeView === "list" ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES}`}
            >
                <ListIcon className="size-4" />
                Liste
            </Link>

            <Link
                href="/dashboard?view=kanban"
                aria-current={activeView === "kanban" ? "page" : undefined}
                className={`${TAB_BASE_CLASSES} ${activeView === "kanban" ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES}`}
            >
                <CalendarIcon className="size-4" />
                Kanban
            </Link>
        </nav>
    );
}
