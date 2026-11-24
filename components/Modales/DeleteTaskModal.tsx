"use client";

import { useActionState } from "react";
import Alert from "@/components/Atoms/Alert";
import Modal from "@/components/Modales/Modal";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { deleteTask } from "@/lib/actions/tasks";
import type { FormState } from "@/types/api";

interface DeleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string;
    taskTitle: string;
}

const initialState: FormState = {};

type DeleteTaskFormProps = Omit<DeleteTaskModalProps, "isOpen">;

/**
 * Content of the confirmation: a form without fields, whose submission deletes the task.
 * It is a separate component because Modal only renders its children while it is open:
 * the error of a previous attempt does not come back when the modal is opened again.
 */
function DeleteTaskForm({ onClose, projectId, taskId, taskTitle }: DeleteTaskFormProps) {
    const { showMessage } = useFlashMessage();

    // Wrapper around the Server Action: the message is shown here, once the action has answered,
    // and not in a useEffect. Once the task is deleted, its card (and so this form) disappears
    // from the page in the same update, an effect would never run. The provider stays mounted.
    // (it ignores the previous state and the form data that useActionState would pass: it needs neither)
    async function deleteAndNotify(): Promise<FormState> {
        const result = await deleteTask(projectId, taskId);

        if (result.success) {
            onClose();
            showMessage(result.success);
        }

        return result;
    }

    const [state, formAction, isPending] = useActionState(deleteAndNotify, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <p className="text-text">
                Voulez-vous vraiment supprimer la tâche « {taskTitle} » ? Cette action est irréversible.
            </p>

            {state.message && <Alert>{state.message}</Alert>}

            <div className="flex flex-wrap gap-3">
                {/* autoFocus: the safe choice has the focus, so a stray Enter deletes nothing */}
                <button
                    type="button"
                    autoFocus
                    onClick={onClose}
                    className="min-h-11 rounded-btn border border-border bg-surface px-6 py-3 text-sm text-text"
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="min-h-11 rounded-btn bg-todo-text px-6 py-3 text-sm text-white disabled:opacity-50"
                >
                    {isPending ? "Suppression…" : "Supprimer"}
                </button>
            </div>
        </form>
    );
}

/**
 * Confirmation modal before deleting a task (the action cannot be undone).
 * The parent (TaskActions) owns the open/closed state.
 */
export default function DeleteTaskModal({ isOpen, onClose, projectId, taskId, taskTitle }: DeleteTaskModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Supprimer la tâche">
            <DeleteTaskForm onClose={onClose} projectId={projectId} taskId={taskId} taskTitle={taskTitle} />
        </Modal>
    );
}
