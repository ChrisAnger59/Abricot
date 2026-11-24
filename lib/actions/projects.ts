"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateCreateProject } from "@/lib/validation";
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
