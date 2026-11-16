"use client";

import { useRef, useState } from "react";
import CreateProjectForm from "@/components/Organisms/CreateProjectForm";

/**
 * Bouton et modale contenant le formulaire de création
 * La modale utilise l'élément natif <dialog>, ouvert avec showModal()
 */
export default function CreateProjectButton() {

    // Référence vers l'élément <dialog>, pour pouvoir appeler ses méthodes
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [formKey, setFormKey] = useState(0);

    function openModale() {
        setFormKey(formKey + 1);
        dialogRef.current?.showModal();
    }

    return (
        <>
            <button 
            type="button" 
            className="rounded-btn bg-dark p-4 text-surface"
            onClick={openModale}
            >
                + Créer un projet
            </button>

            <dialog ref={dialogRef} className="m-auto w-full max-w-lg rounded-card bg-surface p-8 backdrop:bg-black/50">
                <button 
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    aria-label="Fermer"
                    className="absolute top-4 right-4 text-2xl leading-none text-text-muted hover:text-text"
                >
                    x
                </button>
                <CreateProjectForm key={formKey} onSuccess={() => dialogRef.current?.close()}/>
            </dialog>
        </>
    );
}