// Calls apiFetch, which reads the token: must never be sent to the browser
import "server-only";

import { apiFetch } from "@/lib/api";
import { getProgress, type Progress } from "@/lib/utils";
import type { ProjectWithTasksData } from "@/types/api";

/**
 * Gets the progress of a project: its tasks done out of its tasks (cancelled ones left out).
 *
 * NOTE: no API route gives the number of tasks done by project. GET /projects only has the total
 * (`_count.tasks`), and the dashboard routes only count the tasks assigned to the signed-in user.
 * `GET /projects/{id}` is the only one that returns all the tasks of a project with their status
 * (simplified, so lighter than GET /projects/{id}/tasks): one call per project.
 *
 * Returns null if the call fails. The caller then displays "unavailable": a wrong 0 % would
 * mislead the user, and one failing project must not break the page of the others.
 *
 * @param projectId - Id of the project
 * @returns The progress, or null if it could not be read
 */
export async function getProjectProgress(projectId: string): Promise<Progress | null> {
    const result = await apiFetch<ProjectWithTasksData>(`/projects/${encodeURIComponent(projectId)}`);

    if (!result.success) {
        return null;
    }

    return getProgress(result.data.project.tasks);
}
