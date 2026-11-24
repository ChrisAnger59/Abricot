"use client";

import { useState } from "react";
import Alert from "@/components/Atoms/Alert";
import Modal from "@/components/Modales/Modal";
import CreateTaskForm from "@/components/Organisms/CreateTaskForm";
import type { User } from "@/types/api";

interface CreateTaskModalProps {
    projectId: string;
    // People the task can be assigned to (the team of the project)
    users: Pick<User, "id" | "name">[];
}

/**
 * "Créer une tâche" button and the modal containing the task creation form.
 * Owns the open/closed state and the confirmation message; the <dialog> itself is handled by Modal.
 *
 * TODO: replace the confirmation Alert by the centered, dismissible and self-closing message
 * planned for project and task creation (progress and confirmation feature).
 */
export default function CreateTaskModal({ projectId, users }: CreateTaskModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    function openModal() {
        setSuccessMessage("");
        setIsOpen(true);
    }

    function handleSuccess(message: string) {
        setIsOpen(false);
        setSuccessMessage(message);
    }

    return (
        <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
                type="button"
                onClick={openModal}
                className="min-h-11 rounded-btn bg-dark px-6 py-3 text-sm text-white"
            >
                Créer une tâche
            </button>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer une tâche">
                <CreateTaskForm projectId={projectId} users={users} onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
}
