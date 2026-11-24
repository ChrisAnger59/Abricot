"use client";

import { useActionState, useEffect } from "react";
import Alert from "@/components/Atoms/Alert";
import FormField from "@/components/Atoms/FormField";
import TextAreaField from "@/components/Atoms/TextAreaField";
import AssigneesSelect from "@/components/Molecules/AssigneesSelect";
import StatusPicker from "@/components/Molecules/StatusPicker";
import { createTask } from "@/lib/actions/tasks";
import type { FormState, TaskStatus, User } from "@/types/api";

interface CreateTaskFormProps {
    projectId: string;
    // People the task can be assigned to
    users: Pick<User, "id" | "name">[];
    // Called after a successful creation (e.g. to close the modal)
    onSuccess?: (message: string) => void;
}

const initialState: FormState = {};

/**
 * Task creation form: title, description, due date, assignees, status.
 * The title is displayed by the Modal that contains this form.
 */
export default function CreateTaskForm({ projectId, users, onSuccess }: CreateTaskFormProps) {
    // bind pre-fills the first argument of the Server Action (the project id):
    // useActionState then adds the previous state and the form data
    const [state, formAction, isPending] = useActionState(createTask.bind(null, projectId), initialState);

    useEffect(() => {
        if (state.success) {
            onSuccess?.(state.success);
        }
    }, [state, onSuccess]);

    const errors = state.fieldErrors;
    // The form is submitted with a status, so state.values.status is one of the task statuses
    const defaultStatus = (state.values?.status ?? "TODO") as TaskStatus;

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <p className="text-sm text-text-muted">
                <span aria-hidden="true">* </span>Les champs marqués d&apos;un astérisque sont obligatoires.
            </p>

            <FormField
                id="title"
                label="Titre"
                required
                type="text"
                name="title"
                autoComplete="off"
                defaultValue={state.values?.title}
                error={errors?.title}
            />

            <TextAreaField
                id="description"
                label="Description"
                required
                name="description"
                rows={4}
                defaultValue={state.values?.description}
                error={errors?.description}
            />

            <FormField
                id="dueDate"
                label="Échéance"
                required
                type="date"
                name="dueDate"
                defaultValue={state.values?.dueDate}
                error={errors?.dueDate}
            />

            <AssigneesSelect users={users} error={errors?.assigneeIds} />

            <StatusPicker defaultValue={defaultStatus} error={errors?.status} />

            {state.message && <Alert>{state.message}</Alert>}

            <button
                type="submit"
                disabled={isPending}
                className="min-h-11 self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? "Création…" : "+ Ajouter une tâche"}
            </button>
        </form>
    );
}
