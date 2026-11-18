"use client";

import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import type { User } from "@/types/api";
import { searchUsers } from "@/lib/actions/users";
import Alert from "@/components/Atoms/Alert";

// Delay after last input (in milliseconds)
const SEARCH_DELAY = 300;

interface ContributorsSelectProps {
    // Error message, displayed under the field
    error?: string;
}

/**
 * The search is delayed (300ms) and goes after 3 characters
 * Chosen contributors display en tags, send with form
 */
export default function ContributorsSelect({ error }: ContributorsSelectProps) {
    const [results, setResults] = useState<User[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selected, setSelected] = useState<User[]>([]);
    const [searchError, setSearchError] = useState("");

    const handleSearch = useDebouncedCallback(async (query: string) => {
        // No API call before 3 characters
        if (query.trim().length < 3) {
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

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="contributors-search" className="text-sm">
                Contributeurs
            </label>

            {/* Les contributeurs choisis, en étiquettes */}
            {selected.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                {selected.map((user) => (
                    <li
                    key={user.id}
                    className="flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-sm text-primary"
                    >
                    {user.name}
                    <button
                        type="button"
                        onClick={() => removeContributor(user)}
                        aria-label={`Retirer ${user.name}`}
                        className="leading-none"
                    >
                        ×
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
                aria-describedby={error ? "contributors-error" : undefined}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted"
            />

            {/* L'erreur transmise par le formulaire */}
            {error && (
                <p id="contributors-error" className="text-sm text-todo-text">
                {error}
                </p>
            )}

            {/* Les résultats de la recherche, cliquables */}
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

            {/* Les contributeurs choisis, envoyés avec le formulaire */}
            {selected.map((user) => (
                <input key={user.id} type="hidden" name="contributors" value={user.email} />
            ))}
        </div>
    );
}