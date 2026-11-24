"use client";

import { useActionState, useEffect } from "react";
import Alert from "@/components/Atoms/Alert";
import FormField from "@/components/Atoms/FormField";
import TextAreaField from "@/components/Atoms/TextAreaField";
import ContributorsSelect from "@/components/Molecules/ContributorsSelect";
import { PROJECT_DESCRIPTION_MAX_LENGTH, PROJECT_NAME_MAX_LENGTH } from "@/lib/validation";
import type { FormState, User } from "@/types/api";

/** Values a project form starts with when it edits an existing project (nothing when it creates one) */
export interface ProjectFormInitialValues {
    name: string;
    description: string | null;
    // The current contributors (the owner is not one of them)
    contributors: User[];
}

interface ProjectFormProps {
    // Server Action already bound to what it needs (updateProject.bind(null, projectId), ...):
    // the form does not need to know whether it creates or edits
    action: (prevState: FormState, formData: FormData) => Promise<FormState>;
    // Existing project to edit; leave empty to create a new one
    initialValues?: ProjectFormInitialValues;
    // Short explanation displayed under the contributors field
    contributorsHint?: string;
    submitLabel: string;
    pendingLabel: string;
    // Called after a successful submission (e.g. to close the modal)
    onSuccess?: (message: string) => void;
}

const initialState: FormState = {};

/**
 * Project form: name, description, contributors (chosen with a search field).
 * Shared by the creation and the edition of a project, which have the same fields and rules.
 * The title is displayed by the Modal that contains this form.
 *
 * A displayed value is, in order: what the user typed before a validation error (state.values),
 * then the project being edited, then an empty default.
 * `??` only falls back on null / undefined, so a field the user emptied stays empty.
 */
export default function ProjectForm({ action, initialValues, contributorsHint, submitLabel, pendingLabel, onSuccess }: ProjectFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if(state.success) {
            onSuccess?.(state.success);
        }
    }, [state, onSuccess]);

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <p className="text-sm text-text-muted">
                <span aria-hidden="true">* </span>Les champs marqués d&apos;un astérisque sont obligatoires.
            </p>

            <FormField
                id="name"
                label="Titre"
                required
                type="text"
                name="name"
                autoComplete="off"
                maxLength={PROJECT_NAME_MAX_LENGTH}
                placeholder="Nom du projet"
                defaultValue={state.values?.name ?? initialValues?.name}
                error={state.fieldErrors?.name}
            />

            <TextAreaField
                id="description"
                label="Description"
                required
                name="description"
                rows={4}
                maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
                placeholder="Décrivez le projet en quelques mots"
                defaultValue={state.values?.description ?? initialValues?.description ?? ""}
                error={state.fieldErrors?.description}
            />

            <ContributorsSelect
                initialSelected={initialValues?.contributors}
                hint={contributorsHint}
                error={state.fieldErrors?.contributors}
            />

            {state.message &&
                <Alert>{state.message}</Alert>
            }

            <button
                type="submit"
                disabled={isPending}
                className="min-h-11 self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? pendingLabel : submitLabel}
            </button>
        </form>
    )
}
