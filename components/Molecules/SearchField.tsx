"use client";

import SearchIcon from "@/components/Atoms/SearchIcon";
import { MAX_SEARCH_LENGTH } from "@/lib/validation";

interface SearchFieldProps {
    id: string;
    // Accessible name of the field (not displayed: the placeholder is the visible text)
    label: string;
    placeholder: string;
    // Controlled field: the parent owns the typed text, so it can also empty it (reset button)
    value: string;
    onChange: (text: string) => void;
    // Called when the user presses Enter: the parent applies the search without waiting
    onSubmit?: () => void;
    ref?: React.Ref<HTMLInputElement>;
}

/**
 * Search field with a magnifying glass, as on the mockup.
 *
 * It only displays the field: the delay before searching, the minimal length and the URL are
 * decided by the parent, so that the same field can serve the task list and, later, the dashboard.
 *
 * - The label is hidden visually (`sr-only`) but read by screen readers.
 * - A <form> catches the Enter key, which would otherwise do nothing in a lone input.
 * - The native "clear" cross of type="search" is hidden: it would sit under the magnifying glass.
 */
export default function SearchField({ id, label, placeholder, value, onChange, onSubmit, ref }: SearchFieldProps) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.();
            }}
            className="relative w-full sm:w-64"
        >
            <label htmlFor={id} className="sr-only">
                {label}
            </label>

            <input
                ref={ref}
                id={id}
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                maxLength={MAX_SEARCH_LENGTH}
                autoComplete="off"
                className="min-h-11 w-full rounded-btn border border-border bg-surface py-2 pr-12 pl-4 text-sm text-text placeholder:text-text-muted [&::-webkit-search-cancel-button]:appearance-none"
            />

            <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted" />
        </form>
    );
}
