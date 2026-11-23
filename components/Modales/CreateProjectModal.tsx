"use client";

import { useState } from "react";
import Modal from "@/components/Modales/Modal";
import CreateProjectForm from "@/components/Organisms/CreateProjectForm";
import Alert from "@/components/Atoms/Alert";

/**
 * Button and modal containing the project creation form.
 * Owns the open/closed state and the confirmation message; the <dialog> itself is handled by Modal.
 */
export default function CreateProjectModal() {
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
        <div className="flex flex-col items-start gap-2">
            <button
                type="button"
                onClick={openModal}
                className="min-h-11 rounded-btn bg-dark px-6 py-3 text-sm text-white"
            >
                + Créer un projet
            </button>

            {successMessage &&
                <Alert variant="success">{successMessage}</Alert>
            }

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer un nouveau projet">
                <CreateProjectForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
}
