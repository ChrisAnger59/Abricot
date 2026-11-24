"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchField from "@/components/Molecules/SearchField";
import StatusFilter from "@/components/Molecules/StatusFilter";
import { parseTaskFilters } from "@/lib/utils";
import { MIN_SEARCH_LENGTH } from "@/lib/validation";
import type { TaskStatus } from "@/types/api";

// Delay after the last keystroke before the search is applied (in milliseconds)
const SEARCH_DELAY = 300;

/** Text to write in the URL: the trimmed text, or "" (no search) if it is too short */
function toSearchQuery(text: string): string {
    const cleanText = text.trim();

    return cleanText.length >= MIN_SEARCH_LENGTH ? cleanText : "";
}

/**
 * Search field and status filter of the task list.
 *
 * The filters live in the URL (?query=...&status=...): the page reads them (see ProjectDetails)
 * and the server renders the filtered list. This component only writes the URL.
 *
 * - The typed text and the chosen status are also kept in React state, so the fields answer
 *   immediately while the server is still computing the new page, and can be emptied by the
 *   reset button. The URL is only read once, to fill the fields when the page is opened.
 * - The search waits for the user to stop typing (300 ms) and for MIN_SEARCH_LENGTH characters.
 * - `router.replace` instead of `push`: each filter does not add an entry in the history.
 * - `useTransition` tells whether the server is computing the new page (isPending).
 *
 * `useSearchParams` is request data: the parent wraps this component in <Suspense>.
 */
export default function TaskFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();
    const searchRef = useRef<HTMLInputElement>(null);

    // Initial values from the URL. `get` returns the FIRST value of a parameter given twice,
    // like the page does on the server: the fields and the list always agree.
    const initialFilters = parseTaskFilters({
        query: searchParams.get("query") ?? undefined,
        status: searchParams.get("status") ?? undefined,
    });
    const [searchText, setSearchText] = useState(initialFilters.query);
    const [status, setStatus] = useState<TaskStatus | "">(initialFilters.status ?? "");

    // Writes both filters in the URL; an empty filter is left out
    function applyFilters(query: string, selectedStatus: TaskStatus | "") {
        const params = new URLSearchParams();

        if (query !== "") {
            params.set("query", query);
        }

        if (selectedStatus !== "") {
            params.set("status", selectedStatus);
        }

        const queryString = params.toString();

        startTransition(() => {
            replace(queryString ? `${pathname}?${queryString}` : pathname);
        });
    }

    // Under MIN_SEARCH_LENGTH characters, the search is cleared instead of applied.
    // The debounced function always calls the latest version of this callback, so `status` is up to date.
    const applySearch = useDebouncedCallback((text: string) => {
        applyFilters(toSearchQuery(text), status);
    }, SEARCH_DELAY);

    function handleSearchChange(text: string) {
        setSearchText(text);
        applySearch(text);
    }

    function handleStatusChange(selectedStatus: TaskStatus | "") {
        setStatus(selectedStatus);
        // Immediate, and with the text as it is now: a search waiting for its delay is cancelled
        // so it cannot overwrite this change with an older state
        applySearch.cancel();
        applyFilters(toSearchQuery(searchText), selectedStatus);
    }

    function resetFilters() {
        applySearch.cancel();
        setSearchText("");
        setStatus("");
        applyFilters("", "");
        // The reset button disappears: the focus goes to the search field instead of being lost
        searchRef.current?.focus();
    }

    const hasFilters = searchText.trim() !== "" || status !== "";

    return (
        <div role="search" aria-label="Filtrer les tâches" className="flex flex-wrap items-center gap-2">
            <StatusFilter id="task-status-filter" label="Filtrer par statut" value={status} onChange={handleStatusChange} />

            <SearchField
                ref={searchRef}
                id="task-search"
                label="Rechercher une tâche par titre (3 caractères minimum)"
                placeholder="Rechercher une tâche"
                value={searchText}
                onChange={handleSearchChange}
                onSubmit={() => applySearch.flush()}
            />

            {hasFilters && (
                <button
                    type="button"
                    onClick={resetFilters}
                    className="min-h-11 rounded-btn px-4 text-sm text-primary-text underline"
                >
                    Réinitialiser
                </button>
            )}

            {/* Visual hint only: the result is announced by the list itself (role="status") */}
            {isPending && (
                <span aria-hidden="true" className="text-sm text-text-muted">
                    Mise à jour…
                </span>
            )}
        </div>
    );
}
