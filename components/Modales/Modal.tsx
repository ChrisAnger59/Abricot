"use client";

import { useEffect, useId, useRef } from "react";

interface ModalProps {
    // true = the modal is displayed
    isOpen: boolean;
    // Called when the modal closes by itself (Escape key, close button)
    onClose: () => void;
    // Title of the modal, also its accessible name
    title: string;
    children: React.ReactNode;
}

/**
 * Generic modal built on the native <dialog> element.
 *
 * The parent owns the state (`isOpen`): it opens the modal by setting it to true and
 * closes it (e.g. after a successful submission) by setting it to false.
 *
 * - `showModal()` makes the rest of the page inert, traps the focus, closes on Escape
 *   and gives the focus back to the button that opened it: nothing to rebuild by hand.
 * - useEffect is used only to synchronise the native element with the React state.
 * - The children are rendered only while the modal is open: a form inside is created again
 *   (empty) at each opening, without any `key` trick.
 * - The close button is last in the DOM (placed at the top right with CSS), so that the
 *   focus goes to the first field when the modal opens, not to the cross.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    // Unique id, to link the dialog to its title with aria-labelledby
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            // The "close" event also fires when the Escape key closes the dialog
            onClose={onClose}
            aria-labelledby={titleId}
            className="m-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-card bg-surface p-6 backdrop:bg-black/50 sm:p-8"
        >
            {isOpen && (
                <>
                    <h2 id={titleId} className="mb-6 pr-10 font-heading text-lg font-bold text-text">
                        {title}
                    </h2>

                    {children}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                        className="absolute top-3 right-3 flex size-11 items-center justify-center text-2xl leading-none text-text-muted hover:text-text"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </>
            )}
        </dialog>
    );
}
