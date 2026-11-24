"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateComment } from "@/lib/validation";
import type { CommentData, FormState } from "@/types/api";

/**
 * Adds a comment to a task. The author is the signed-in user: the API reads it from the token,
 * nothing about the author is sent.
 *
 * `projectId` and `taskId` are the first arguments: the form passes them itself, then useActionState
 * adds the previous state and the form data. They are not hidden fields, which the user could edit
 * (the API checks the access anyway).
 *
 * The rules are checked here before calling the API. The text is sent as it is typed (only trimmed):
 * the API does not clean it, so it must always be displayed as plain text, never as HTML.
 *
 * A task that no longer exists (404 TASK_NOT_FOUND, e.g. deleted from another tab) gets its own
 * message and the list is refreshed, so the user sees that the card is gone.
 *
 * @param projectId - Id of the project the task belongs to
 * @param taskId - Id of the task to comment
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form (field "content")
 * @returns The errors or the confirmation to display, and the text to display again
 */
export async function addComment(projectId: string, taskId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
    const content = getString(formData, "content");

    const values = { content };

    const fieldErrors = validateComment(content);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const result = await apiFetch<CommentData>(
        `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}/comments`,
        {
            method: "POST",
            body: JSON.stringify({ content }),
        }
    );

    if (!result.success) {
        if (result.error === "TASK_NOT_FOUND") {
            refresh();

            // Returned as a "success" message on purpose: the card (and its form) is removed from
            // the page by the refresh, so an error shown inside the form would be lost. A success
            // message is shown by the shared message, which stays on screen.
            return { success: "Cette tâche n'existe plus : la liste a été actualisée." };
        }

        return {
            message: result.message,
            fieldErrors: getFieldErrors(result),
            values
        };
    }

    refresh();

    return { success: "Commentaire ajouté." };
}
