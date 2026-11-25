import CalendarIcon from "@/components/Atoms/CalendarIcon";
import ListIcon from "@/components/Atoms/ListIcon";

/**
 * "Liste" / "Kanban" tabs of the dashboard, as on the mockup.
 *
 * "Liste" is the current view. "Kanban" is displayed but disabled until that view exists.
 * Same pattern as the "Liste" / "Calendrier" tabs of the project page: not role="tablist",
 * because there are no panels to switch between.
 */
export default function ViewTabs() {
    return (
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
                Kanban
            </button>
        </div>
    );
}
