"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, validateCreateProject } from "@/lib/validation";
import type { AuthFormState, ProjectData } from "@/types/api";



/**
 * Crée un projet, avec ses éventuels contributeurs.
 *
 * Les contributeurs sont saisis dans un seul champ, séparés par des virgules,
 * puis transformés en tableau d'e-mails (format attendu par l'API).
 *
 * @param _prevState - État précédent du formulaire, imposé par useActionState (non utilisé)
 * @param formData - Données envoyées par le formulaire
 * @returns Les erreurs ou la confirmation à afficher, et les valeurs à réafficher
 */
export async function createProject(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {

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