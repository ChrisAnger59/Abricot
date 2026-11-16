"use client";

import { useActionState } from "react";
import FormField from "@/components/Atoms/FormField";
import type { AuthFormState, ProjectData } from "@/types/api";
import { createProject } from "@/lib/actions/projects";

const initialState: AuthFormState = {};

export default function CreateProjectForm() {
    const [state, formAction, isPending] = useActionState(createProject, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-6">

            <div>
                <h2 className="font-bold">Créer un nouveau projet</h2>
            </div>

            <FormField
                id="name"
                label="Nom"
                type="text"
                name="name"
                placeholder="Nom du projet"
                defaultValue={state.values?.name}
                error={state.fieldErrors?.name}
            />

            <FormField
                id="description"
                label="description"
                type="text"
                name="description"
                placeholder="Saisissez une description du projet"
                defaultValue={state.values?.description}
                error={state.fieldErrors?.description}
            />

            <FormField
                id="contributors"
                label="Contributeurs"
                type="text"
                name="contributors"
                error={state.fieldErrors?.contributors}
            />

            {state.message && (
                <p className="text-sm text-todo-text">{state.message}</p>
            )}

            {state.success && (
                <p role="status" className="text-sm text-done-text">{state.success}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? "Enregistrement..." : "Créer le projet"}
            </button>
        </form>
    )
}