"use client";

import { useState } from "react";
import ChevronDownIcon from "@/components/Atoms/ChevronDownIcon";
import type { User } from "@/types/api";

/** The only user data needed here: no need to send e-mails to the browser */
type Assignee = Pick<User, "id" | "name">;

interface AssigneesSelectProps {
    // People the task can be assigned to (the team of the project)
    users: Assignee[];
    // Error message, displayed under the field
    error?: string;
}

/**
 * Multiple choice of the people a task is assigned to: a native <details> that unfolds a list
 * of checkboxes, with a summary of the choice (nothing, one name, "2 collaborateurs").
 *
 * The team is already known, so there is no search (unlike the contributors of a project).
 * The selection lives in React state so that the summary follows it and it survives a
 * validation error (the form is reset after each submission, see defaultChecked below).
 * Each checked box is submitted as one "assigneeIds" value.
 */
export default function AssigneesSelect({ users, error }: AssigneesSelectProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // New array each time: a React state is never modified in place
    function toggleUser(userId: string) {
        setSelectedIds(
            selectedIds.includes(userId)
                ? selectedIds.filter((id) => id !== userId)
                : [...selectedIds, userId]
        );
    }

    const selectedUsers = users.filter((user) => selectedIds.includes(user.id));

    let summary = "Choisir un ou plusieurs collaborateurs";
    if (selectedUsers.length === 1) {
        summary = selectedUsers[0].name;
    } else if (selectedUsers.length > 1) {
        summary = `${selectedUsers.length} collaborateurs`;
    }

    return (
        <fieldset
            aria-describedby={error ? "assignees-error" : undefined}
            className="flex flex-col gap-2"
        >
            <legend className="mb-2 text-sm">Assigné à :</legend>

            <details className="group rounded-btn border border-border">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
                    <span className={selectedUsers.length === 0 ? "text-text-muted" : "text-text"}>
                        {summary}
                    </span>
                    <ChevronDownIcon className="size-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>

                <ul className="flex flex-col border-t border-border">
                    {users.map((user) => (
                        <li key={user.id}>
                            <label className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-page">
                                <input
                                    type="checkbox"
                                    name="assigneeIds"
                                    value={user.id}
                                    // defaultChecked, not checked: React resets a form after its action,
                                    // which unchecks controlled boxes in the DOM while the state still
                                    // holds them. defaultChecked is the value the reset goes back to.
                                    defaultChecked={selectedIds.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                    className="size-4"
                                />
                                {user.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </details>

            {error && (
                <p id="assignees-error" className="text-sm text-todo-text">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
