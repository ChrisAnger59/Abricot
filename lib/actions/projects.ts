"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateCreateProject, validateProjectForm } from "@/lib/validation";
import type { FormState, ProjectData } from "@/types/api";



/**
 * Creates a project, with its contributors.
 *
 * Contributors are chosen in the form (one hidden "contributors" field per person)
 * and sent to the API as an array of e-mails, the format it expects.
 *
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 * @returns The errors or the confirmation to display, and the values to display again
 */
export async function createProject(_prevState: FormState, formData: FormData): Promise<FormState> {

    const name = getString(formData, "name");
    const description = getString(formData, "description");
    // hidden "contributors" field
    const contributors = formData.getAll("contributors").filter((value): value is string => typeof value === "string");

    const values = { name, description };

    // Front validation: if invalid field, API not called
    const fieldErrors = validateCreateProject(name, description, contributors)

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const result = await apiFetch<ProjectData>("/projects", {
        method: "POST",
        body: JSON.stringify({ name, description, contributors }),
    });

    if (!result.success) {
        return {
            message: result.message,
            fieldErrors: getFieldErrors(result),
            values
        };
    }

    refresh();

    return { success: "Projet créé avec succès !"};
}


/**
 * Updates a project: name, description and contributors.
 *
 * NOTE: the API splits this over three kinds of calls. `PUT /projects/{id}` only changes the name and
 * the description; each contributor is added with `POST .../contributors` (by e-mail) and removed
 * with `DELETE .../contributors/{userId}` (by id). These calls are not atomic: if one fails, the
 * earlier ones are not undone.
 *
 * Order of the work:
 * 1. validation, with no call at all if a field is invalid;
 * 2. `GET` of the project, to know its members NOW. The difference between the current team and
 *    the chosen one is computed from this answer, not from what the browser thinks the starting
 *    point was (a form left open for a while can be out of date);
 * 3. `PUT` of the name and the description, before touching the team, so that a validation error
 *    of the API arrives before any change;
 * 4. one `POST` per person to add and one `DELETE` per person to remove, one after the other.
 *
 * If some team changes fail, the project is saved anyway: the confirmation message says what was
 * not applied, instead of an error that would make the user believe nothing was saved.
 * The owner is never added nor removed.
 *
 * `projectId` is the first argument: the form binds it with `updateProject.bind(null, projectId)`.
 *
 * @param projectId - Id of the project to update
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 * @returns The errors or the confirmation to display, and the values to display again
 */
export async function updateProject(projectId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
    const name = getString(formData, "name");
    const description = getString(formData, "description");
    // Lower case: the API looks users up in lower case. A Set removes the duplicates.
    const chosenEmails = [...new Set(
        formData.getAll("contributors")
            .filter((value): value is string => typeof value === "string")
            .map((email) => email.trim().toLowerCase())
            .filter((email) => email !== "")
    )];

    const values = { name, description };

    const fieldErrors = validateProjectForm(name, description);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const projectPath = `/projects/${encodeURIComponent(projectId)}`;

    // The current members, read from the server
    const currentResult = await apiFetch<ProjectData>(projectPath);

    if (!currentResult.success) {
        return { message: currentResult.message, values };
    }

    const currentProject = currentResult.data.project;

    const updateResult = await apiFetch<ProjectData>(projectPath, {
        method: "PUT",
        body: JSON.stringify({ name, description }),
    });

    if (!updateResult.success) {
        return {
            message: updateResult.message,
            fieldErrors: getFieldErrors(updateResult),
            values
        };
    }

    // Difference between the current team and the chosen one.
    // A Set answers "is this e-mail in the list?" in one step (has).
    const chosenSet = new Set(chosenEmails);
    const currentSet = new Set(currentProject.members.map((member) => member.user.email.toLowerCase()));
    const ownerEmail = currentProject.owner.email.toLowerCase();

    const emailsToAdd = chosenEmails.filter((email) => !currentSet.has(email) && email !== ownerEmail);
    const membersToRemove = currentProject.members.filter(
        (member) => member.userId !== currentProject.ownerId && !chosenSet.has(member.user.email.toLowerCase())
    );

    const notAdded: string[] = [];
    const notRemoved: string[] = [];

    for (const email of emailsToAdd) {
        // NOTE: always send an e-mail: a POST without one makes the API answer a 500
        const addResult = await apiFetch<undefined>(`${projectPath}/contributors`, {
            method: "POST",
            body: JSON.stringify({ email }),
        });

        if (!addResult.success) {
            notAdded.push(email);
        }
    }

    for (const member of membersToRemove) {
        const removeResult = await apiFetch<undefined>(`${projectPath}/contributors/${encodeURIComponent(member.userId)}`, {
            method: "DELETE",
        });

        if (!removeResult.success) {
            notRemoved.push(member.user.name);
        }
    }

    // The project changed in any case: show the new data
    refresh();

    if (notAdded.length > 0 || notRemoved.length > 0) {
        const problems: string[] = [];

        if (notAdded.length > 0) {
            problems.push(`non ajouté : ${notAdded.join(", ")}`);
        }

        if (notRemoved.length > 0) {
            problems.push(`non retiré : ${notRemoved.join(", ")}`);
        }

        return { success: `Projet modifié, mais l'équipe n'a pas été entièrement mise à jour (${problems.join(" ; ")}).` };
    }

    return { success: "Projet modifié avec succès !" };
}
