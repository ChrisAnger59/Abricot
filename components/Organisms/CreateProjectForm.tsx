"use client";

import { useActionState, useEffect } from "react";
import FormField from "@/components/Atoms/FormField";
import type { AuthFormState } from "@/types/api";
import { createProject } from "@/lib/actions/projects";
import ContributorsSelect from "@/components/Molecules/ContributorsSelect";
import Alert from "@/components/Atoms/Alert";


interface CreateProjectFormProps {
    // Called after succeded creation (ex: for closing the modale)
    onSuccess?: (message: string) => void;
}

const initialState: AuthFormState = {};


/**
 * Project Creation Form: name, description, contributors
 * Contributors are entered in one input, with , between
 */
export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const [state, formAction, isPending] = useActionState(createProject, initialState);

    useEffect(() => {
        if(state.success) {
            onSuccess?.(state.success);
        }
    }, [state, onSuccess]);

    const descriptionError = state.fieldErrors?.description;

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <h2 className="text-lg font-bold">Créer un nouveau projet</h2>

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

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm">
                Description
                </label>
                <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Décrivez le projet en quelques mots"
                defaultValue={state.values?.description}
                aria-invalid={descriptionError ? true : undefined}
                aria-describedby={descriptionError ? "description-error" : undefined}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted"
                />
                {descriptionError && (
                <p id="description-error" className="text-sm text-todo-text">
                    {descriptionError}
                </p>
                )}
            </div>

            <ContributorsSelect error={state.fieldErrors?.contributors} />

            {state.message &&
                <Alert>{state.message}</Alert>
            }

            <button
                type="submit"
                disabled={isPending}
                className="self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? "Création…" : "Créer le projet"}
            </button>
        </form>
    )
}