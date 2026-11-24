"use client";

import { useActionState, useEffect } from "react";
import FormField from "@/components/Atoms/FormField";
import TextAreaField from "@/components/Atoms/TextAreaField";
import type { FormState } from "@/types/api";
import { createProject } from "@/lib/actions/projects";
import ContributorsSelect from "@/components/Molecules/ContributorsSelect";
import Alert from "@/components/Atoms/Alert";


interface CreateProjectFormProps {
    // Called after a successful creation (e.g. to close the modal)
    onSuccess?: (message: string) => void;
}

const initialState: FormState = {};


/**
 * Project creation form: name, description, contributors (chosen with a search field).
 * The title is displayed by the Modal that contains this form.
 */
export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const [state, formAction, isPending] = useActionState(createProject, initialState);

    useEffect(() => {
        if(state.success) {
            onSuccess?.(state.success);
        }
    }, [state, onSuccess]);

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <FormField
                id="name"
                label="Nom"
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Nom du projet"
                defaultValue={state.values?.name}
                error={state.fieldErrors?.name}
            />

            <TextAreaField
                id="description"
                label="Description"
                name="description"
                rows={4}
                placeholder="Décrivez le projet en quelques mots"
                defaultValue={state.values?.description}
                error={state.fieldErrors?.description}
            />

            <ContributorsSelect error={state.fieldErrors?.contributors} />

            {state.message &&
                <Alert>{state.message}</Alert>
            }

            <button
                type="submit"
                disabled={isPending}
                className="min-h-11 self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? "Création…" : "Créer le projet"}
            </button>
        </form>
    )
}