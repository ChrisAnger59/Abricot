"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateTaskForm } from "@/lib/validation";
import type { FormState, TaskData } from "@/types/api";

/**
 * Reads the fields of the task form (shared by createTask and updateTask).
 * Not exported: in a "use server" file, only Server Actions can be exported.
 */
function readTaskForm(formData: FormData) {
    return {
        title: getString(formData, "title"),
        description: getString(formData, "description"),
        dueDate: getString(formData, "dueDate"),
        status: getString(formData, "status"),
        // One "assigneeIds" value per checked box
        assigneeIds: formData.getAll("assigneeIds").filter((value): value is string => typeof value === "string"),
    };
}

/** Path of a project in the API, with the id encoded since it comes from the URL */
function getProjectPath(projectId: string): string {
    return `/projects/${encodeURIComponent(projectId)}`;
}

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
    const { title, description, dueDate, status, assigneeIds } = readTaskForm(formData);

    const values = { title, description, dueDate, status };

    const fieldErrors = validateTaskForm(title, description, dueDate, status);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const projectPath = getProjectPath(projectId);

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

/**
 * Updates a task: title, description, due date, assignees and status, in a single call.
 *
 * NOTE: unlike the creation, PUT accepts the status, so there is no second call.
 * The assignees are replaced as a whole: the API keeps exactly the ids it receives, and an
 * empty array removes everyone (checked with real calls).
 *
 * `projectId` and `taskId` are bound by the form, like in createTask.
 *
 * @param projectId - Id of the project the task belongs to
 * @param taskId - Id of the task to update
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 * @returns The errors or the confirmation to display, and the values to display again
 */
export async function updateTask(projectId: string, taskId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
    const { title, description, dueDate, status, assigneeIds } = readTaskForm(formData);

    const values = { title, description, dueDate, status };

    const fieldErrors = validateTaskForm(title, description, dueDate, status);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const result = await apiFetch<TaskData>(`${getProjectPath(projectId)}/tasks/${encodeURIComponent(taskId)}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, dueDate, status, assigneeIds }),
    });

    if (!result.success) {
        return {
            message: result.message,
            fieldErrors: getFieldErrors(result),
            values
        };
    }

    refresh();

    return { success: "Tâche modifiée avec succès !" };
}

/**
 * Deletes a task.
 *
 * A task that no longer exists (404 TASK_NOT_FOUND, e.g. deleted from another tab) is not an
 * error for the user: the goal "this task is gone" is reached, so the list is refreshed and the
 * message says what happened.
 *
 * @param projectId - Id of the project the task belongs to
 * @param taskId - Id of the task to delete
 */
export async function deleteTask(projectId: string, taskId: string): Promise<FormState> {
    // NOTE: the API answers without a "data" field for a deletion
    const result = await apiFetch<undefined>(`${getProjectPath(projectId)}/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
    });

    if (!result.success) {
        if (result.error === "TASK_NOT_FOUND") {
            refresh();

            return { success: "Cette tâche n'existe plus : la liste a été actualisée." };
        }

        return { message: result.message };
    }

    refresh();

    return { success: "Tâche supprimée." };
}
