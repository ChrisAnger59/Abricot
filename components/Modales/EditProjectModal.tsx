"use client";

import { useState } from "react";
import Modal from "@/components/Modales/Modal";
import ProjectForm, { type ProjectFormInitialValues } from "@/components/Organisms/ProjectForm";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { updateProject } from "@/lib/actions/projects";

// Explains a particularity of the API: removing a contributor does not clean up the tasks
const CONTRIBUTORS_HINT = "Retirer une personne du projet ne la retire pas des tâches qui lui sont déjà assignées.";

interface EditProjectModalProps {
    projectId: string;
    // Current values of the project, displayed in the form
    project: ProjectFormInitialValues;
}

/**
 * "Modifier" button of the project page and the modal containing the form to edit the project.
 * Owns the open/closed state; the <dialog> itself is handled by Modal and the confirmation
 * message by the shared FlashMessageProvider.
 *
 * It is a real <button> (it opens a modal, it does not go to another page) styled as a link.
 * Its accessible name contains the visible word "Modifier" and says what is modified.
 * The page only displays it to the administrators of the project; the API checks the right anyway.
 */
export default function EditProjectModal({ projectId, project }: EditProjectModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { showMessage } = useFlashMessage();

    function handleSuccess(message: string) {
        setIsOpen(false);
        showMessage(message);
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={`Modifier le projet ${project.name}`}
                className="min-h-11 px-2 text-sm text-primary-text underline"
            >
                Modifier
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modifier un projet">
                <ProjectForm
                    // bind pre-fills the project id: the form then only adds the previous state and the data
                    action={updateProject.bind(null, projectId)}
                    initialValues={project}
                    contributorsHint={CONTRIBUTORS_HINT}
                    submitLabel="Enregistrer"
                    pendingLabel="Enregistrement…"
                    onSuccess={handleSuccess}
                />
            </Modal>
        </>
    );
}
