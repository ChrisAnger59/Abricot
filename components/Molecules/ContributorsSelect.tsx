"use client";

import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import type { User } from "@/types/api";
import { searchUsers } from "@/lib/actions/users";
import { MIN_SEARCH_LENGTH } from "@/lib/validation";
import Alert from "@/components/Atoms/Alert";

// Delay after last input (in milliseconds)
const SEARCH_DELAY = 300;

interface ContributorsSelectProps {
    // People already chosen when the field appears (the current contributors when editing a project)
    initialSelected?: User[];
    // Short explanation displayed under the field, linked to it for screen readers
    hint?: string;
    // Error message, displayed under the field
    error?: string;
}

/**
 * Choice of the contributors of a project.
 *
 * The search is delayed (300 ms) and starts at MIN_SEARCH_LENGTH characters. The chosen
 * contributors are displayed as tags, and sent with the form (one hidden "contributors" field
 * per person, holding the e-mail, which is what the API expects).
 */
export default function ContributorsSelect({ initialSelected = [], hint, error }: ContributorsSelectProps) {
    const [results, setResults] = useState<User[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selected, setSelected] = useState<User[]>(initialSelected);
    const [searchError, setSearchError] = useState("");

    const handleSearch = useDebouncedCallback(async (query: string) => {
        // No API call before MIN_SEARCH_LENGTH characters
        if (query.trim().length < MIN_SEARCH_LENGTH) {
            setResults([]);
            setHasSearched(false);
            setSearchError("");
            return;
        }

        const { users, error } = await searchUsers(query);
        setResults(users);
        setSearchError(error ?? "");
        setHasSearched(true);

    }, SEARCH_DELAY);

    // New Array
    function addContributor(user: User) {
        setSelected([...selected, user]);
    }

    // filter return a new array without this user
    function removeContributor(user: User) {
        setSelected(selected.filter((s) => s.id !== user.id))
    }

    // Chosen results are no longer suggested
    const availableResults = results.filter(
        (user) => !selected.some((s) => s.id === user.id)
    );

    // The input is described by its hint and, if there is one, its error
    const describedBy = [hint ? "contributors-hint" : "", error ? "contributors-error" : ""].filter(Boolean).join(" ");

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="contributors-search" className="text-sm">
                Contributeurs
            </label>

            {/* The chosen contributors, as tags */}
            {selected.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                {selected.map((user) => (
                    <li
                    key={user.id}
                    className="flex items-center gap-2 rounded-full bg-primary-light py-1 pr-1 pl-3 text-sm text-primary-text"
                    >
                    {user.name}
                    <button
                        type="button"
                        onClick={() => removeContributor(user)}
                        aria-label={`Retirer ${user.name}`}
                        className="flex size-6 items-center justify-center leading-none"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                    </li>
                ))}
                </ul>
            )}

            <input
                id="contributors-search"
                type="search"
                placeholder="Rechercher par nom ou e-mail (3 lettres minimum)"
                autoComplete="off"
                onChange={(event) => handleSearch(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted"
            />

            {hint && (
                <p id="contributors-hint" className="text-sm text-text-muted">
                    {hint}
                </p>
            )}

            {/* The error returned by the form */}
            {error && (
                <p id="contributors-error" className="text-sm text-todo-text">
                {error}
                </p>
            )}

            {/* The results of the search, clickable */}
            {availableResults.length > 0 && (
                <ul className="flex flex-col rounded-btn border border-border">
                {availableResults.map((user) => (
                    <li key={user.id}>
                    <button
                        type="button"
                        onClick={() => addContributor(user)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-page"
                    >
                        {user.name} <span className="text-text-muted">({user.email})</span>
                    </button>
                    </li>
                ))}
                </ul>
            )}

            {searchError &&
                <Alert>{searchError}</Alert>
            }

            {hasSearched && !searchError && results.length === 0 && (
                <p className="text-sm text-text-muted">Aucun utilisateur trouvé.</p>
            )}

            {/* The chosen contributors, sent with the form */}
            {selected.map((user) => (
                <input key={user.id} type="hidden" name="contributors" value={user.email} />
            ))}
        </div>
    );
}
