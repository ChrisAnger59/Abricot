"use client";

import { useActionState, useEffect } from "react";
import Alert from "@/components/Atoms/Alert";
import FormField from "@/components/Atoms/FormField";
import TextAreaField from "@/components/Atoms/TextAreaField";
import AssigneesSelect from "@/components/Molecules/AssigneesSelect";
import StatusPicker from "@/components/Molecules/StatusPicker";
import { toDateInputValue } from "@/lib/utils";
import type { FormState, TaskStatus, User } from "@/types/api";

/** Values a task form starts with when it edits an existing task (nothing when it creates one) */
export interface TaskFormInitialValues {
    title: string;
    description: string | null;
    // ISO date as sent by the API (midnight UTC), or null
    dueDate: string | null;
    status: TaskStatus;
    assigneeIds: string[];
}

interface TaskFormProps {
    // Server Action already bound to its ids (createTask.bind(null, projectId), ...):
    // the form does not need to know whether it creates or edits
    action: (prevState: FormState, formData: FormData) => Promise<FormState>;
    // People the task can be assigned to
    users: Pick<User, "id" | "name">[];
    // Existing task to edit; leave empty to create a new one
    initialValues?: TaskFormInitialValues;
    submitLabel: string;
    pendingLabel: string;
    // Called after a successful submission (e.g. to close the modal)
    onSuccess?: (message: string) => void;
}

const initialState: FormState = {};

/**
 * Task form: title, description, due date, assignees, status.
 * Shared by the creation and the edition of a task, which have the same fields and rules.
 * The title is displayed by the Modal that contains this form.
 *
 * A displayed value is, in order: what the user typed before a validation error
 * (state.values), then the task being edited, then an empty default.
 * `??` only falls back on null / undefined, so a field the user emptied stays empty.
 */
export default function TaskForm({ action, users, initialValues, submitLabel, pendingLabel, onSuccess }: TaskFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if (state.success) {
            onSuccess?.(state.success);
        }
    }, [state, onSuccess]);

    const errors = state.fieldErrors;
    // The form is submitted with a status, so state.values.status is one of the task statuses
    const defaultStatus = (state.values?.status ?? initialValues?.status ?? "TODO") as TaskStatus;

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
                defaultValue={state.values?.title ?? initialValues?.title}
                error={errors?.title}
            />

            <TextAreaField
                id="description"
                label="Description"
                required
                name="description"
                rows={4}
                defaultValue={state.values?.description ?? initialValues?.description ?? ""}
                error={errors?.description}
            />

            <FormField
                id="dueDate"
                label="Échéance"
                required
                type="date"
                name="dueDate"
                defaultValue={state.values?.dueDate ?? (initialValues?.dueDate ? toDateInputValue(initialValues.dueDate) : "")}
                error={errors?.dueDate}
            />

            <AssigneesSelect
                users={users}
                initialSelectedIds={initialValues?.assigneeIds}
                error={errors?.assigneeIds}
            />

            <StatusPicker
                defaultValue={defaultStatus}
                // A task already cancelled keeps its option, otherwise no button would be checked
                showCancelled={initialValues?.status === "CANCELLED"}
                error={errors?.status}
            />

            {state.message && <Alert>{state.message}</Alert>}

            <button
                type="submit"
                disabled={isPending}
                className="min-h-11 self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? pendingLabel : submitLabel}
            </button>
        </form>
    );
}
