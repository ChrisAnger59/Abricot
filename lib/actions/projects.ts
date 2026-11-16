"use server";

import { refresh } from "next/cache";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { getString, parseEmails, validateCreateProject } from "@/lib/validation";
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
    const contributorsRaw = getString(formData, "contributors");

    const contributors = parseEmails(contributorsRaw);
    const values = { name, description, contributors: contributorsRaw };

    // Validation locale : si un champ est invalide, l'API n'est pas appelée
    const fieldErrors = validateCreateProject(name, contributors);

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, values };
    }

    const result = await apiFetch<ProjectData>("/projects", {
        method: "POST",
        body: JSON.stringify({
            name,

            // Une description vide n'est pas envoyée (champ facultatif pour l'API)
            description: description || undefined,
            contributors
        })
    });

    if (!result.success) {
        return {
            message: result.message,
            fieldErrors: getFieldErrors(result),
            values
        };
    }

    // La liste des projets de la page sera récupérée à nouveau, avec le nouveau projet
    refresh();

    return {
        success: "Projet créé avec succès"
    };
}