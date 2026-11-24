"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateCreateTask } from "@/lib/validation";
import type { FormState, TaskData } from "@/types/api";

/**
 * Creates a task in a project, with its assignees and its status.
 *
 * NOTE: the API ignores `status` when creating a task (it is always "TODO"), but accepts it
 * when updating. A status other than "TODO" therefore costs a second call: PUT after POST.
 * If that second call fails, the task exists with the status "TODO": the confirmation message
 * says so, instead of an error that would make the user create the task a second time.
 *
 * `projectId` is the first argument: the form binds it with `createTask.bind(null, projectId)`,
 * then useActionState adds the previous state and the form data. It is not a hidden field,
 * which the user could edit (the API checks the access to the project anyway).
 *
 * All the rules are checked here before calling the API.
 *
 * @param projectId - Id of the project the task is created in
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 * @returns The errors or the confirmation to display, and the values to display again
 */
export async function createTask(projectId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
    const title = getString(formData, "title");
    const description = getString(formData, "description");
    const dueDate = getString(formData, "dueDate");
    const status = getString(formData, "status");
    // One "assigneeIds" value per checked box
    const assigneeIds = formData.getAll("assigneeIds").filter((value): value is string => typeof value === "string");

    const values = { title, description, dueDate, status };

    const fieldErrors = validateCreateTask(title, description, dueDate, status);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const projectPath = `/projects/${encodeURIComponent(projectId)}`;

    const result = await apiFetch<TaskData>(`${projectPath}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title, description, dueDate, assigneeIds }),
    });

    if (!result.success) {
        return {
            message: result.message,
            fieldErrors: getFieldErrors(result),
            values
        };
    }

    if (status !== "TODO") {
        const statusResult = await apiFetch<TaskData>(`${projectPath}/tasks/${result.data.task.id}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });

        if (!statusResult.success) {
            // The task was created: refresh the list before telling the user
            refresh();

            return { success: "Tâche créée, mais son statut n'a pas pu être appliqué : elle est « À faire »." };
        }
    }

    refresh();

    return { success: "Tâche créée avec succès !" };
}
