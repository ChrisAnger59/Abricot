"use client";

import { useState } from "react";
import Modal from "@/components/Modales/Modal";
import TaskForm from "@/components/Organisms/TaskForm";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { createTask } from "@/lib/actions/tasks";
import type { User } from "@/types/api";

interface CreateTaskModalProps {
    projectId: string;
    // People the task can be assigned to (the team of the project)
    users: Pick<User, "id" | "name">[];
}

/**
 * "Créer une tâche" button and the modal containing the task form.
 * Owns the open/closed state; the <dialog> itself is handled by Modal and the confirmation
 * message by the shared FlashMessageProvider.
 */
export default function CreateTaskModal({ projectId, users }: CreateTaskModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { showMessage } = useFlashMessage();

    function handleSuccess(message: string) {
        setIsOpen(false);
        showMessage(message);
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="min-h-11 rounded-btn bg-dark px-6 py-3 text-sm text-white"
            >
                Créer une tâche
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer une tâche">
                <TaskForm
                    // bind pre-fills the project id: the form then only adds the previous state and the data
                    action={createTask.bind(null, projectId)}
                    users={users}
                    submitLabel="+ Ajouter une tâche"
                    pendingLabel="Création…"
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    );
}
