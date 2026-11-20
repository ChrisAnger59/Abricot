"use client";

import { useRef, useState } from "react";
import CreateProjectForm from "@/components/Organisms/CreateProjectForm";
import Alert from "@/components/Atoms/Alert";

/**
 * Bouton et modale contenant le formulaire de création
 * La modale utilise l'élément natif <dialog>, ouvert avec showModal()
 */
export default function CreateProjectButton() {

    // Référence vers l'élément <dialog>, pour pouvoir appeler ses méthodes
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [formKey, setFormKey] = useState(0);

    const [successMessage, setSuccessMessage] = useState("");

    function openModale() {
        setSuccessMessage("");
        setFormKey(formKey + 1);
        dialogRef.current?.showModal();
    }

    function handleSuccess(message: string) {
        dialogRef.current?.close();
        setSuccessMessage(message);
    }

    return (
        <div className="flex flex-col items-start gap-2">
            <button
                type="button"
                onClick={openModale}
                className="rounded-btn bg-dark px-6 py-3 text-sm text-white"
            >
                + Créer un projet
            </button>

            {successMessage && 
                <Alert variant="success">{successMessage}</Alert>
            }

            <dialog
                ref={dialogRef}
                className="m-auto w-full max-w-lg rounded-card bg-surface p-8 backdrop:bg-black/50"
            >
                <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Fermer"
                className="absolute top-4 right-4 text-2xl leading-none text-text-muted hover:text-text"
                >
                ×
                </button>

                <CreateProjectForm key={formKey} onSuccess={handleSuccess} />
            </dialog>
        </div>
    );
}