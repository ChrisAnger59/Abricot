"use client";

import { useState } from "react";
import Modal from "@/components/Modales/Modal";
import ProjectForm from "@/components/Organisms/ProjectForm";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { createProject } from "@/lib/actions/projects";

/**
 * Button and modal containing the project creation form.
 * Owns the open/closed state; the <dialog> itself is handled by Modal and the confirmation
 * message by the shared FlashMessageProvider.
 */
export default function CreateProjectModal() {
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
                + Créer un projet
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer un nouveau projet">
                <ProjectForm
                    action={createProject}
                    submitLabel="Créer le projet"
                    pendingLabel="Création…"
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    );
}
