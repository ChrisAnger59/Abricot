"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// How long a message stays on screen (in milliseconds)
const DISPLAY_DURATION = 6000;

interface FlashMessageContextValue {
    // Displays a confirmation message, centered at the top of the screen
    showMessage: (text: string) => void;
}

interface FlashMessage {
    // Changes at each call, so the same text shown twice in a row restarts the timer
    // and is announced again by screen readers
    id: number;
    text: string;
}

const FlashMessageContext = createContext<FlashMessageContextValue | null>(null);

/**
 * Shared confirmation message ("Tâche créée…", "Tâche supprimée…") for the whole signed-in area.
 *
 * Why a context instead of a message inside each modal: after a deletion the task card (and the
 * modal that lives in it) disappears, taking a local message with it. This provider sits in the
 * layout, so it is never unmounted by a page update.
 *
 * - The message is centered, can be closed with a button, and disappears by itself after 6 s.
 *   The timer is paused while the pointer or the keyboard focus is on the message, so that
 *   nobody is rushed (WCAG 2.2.1).
 * - The container with role="status" is always in the page: a live region must exist before its
 *   content changes for screen readers to announce the new message reliably.
 */
export function FlashMessageProvider({ children }: { children: React.ReactNode }) {
    const [flash, setFlash] = useState<FlashMessage | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // useCallback keeps the same function between renders: components that use the context
    // do not re-render each time the message changes
    const showMessage = useCallback((text: string) => {
        setFlash((current) => ({ id: (current?.id ?? 0) + 1, text }));
    }, []);

    // Same reason for useMemo: the context value is created once
    const contextValue = useMemo(() => ({ showMessage }), [showMessage]);

    // Timer synchronised with the message. The cleanup cancels it when the message changes,
    // when it is paused, or when the provider unmounts.
    useEffect(() => {
        if (!flash || isPaused) {
            return;
        }

        const timer = setTimeout(() => setFlash(null), DISPLAY_DURATION);

        return () => clearTimeout(timer);
    }, [flash, isPaused]);

    return (
        <FlashMessageContext value={contextValue}>
            {children}

            <div
                role="status"
                className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
            >
                {flash && (
                    <div
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                        className="pointer-events-auto flex max-w-lg items-center gap-3 rounded-btn border border-done-text bg-done-bg py-1 pr-1 pl-4 text-sm text-done-text shadow-header"
                    >
                        <span aria-hidden="true">✓</span>
                        <p>{flash.text}</p>
                        <button
                            type="button"
                            onClick={() => setFlash(null)}
                            aria-label="Fermer le message"
                            className="flex size-11 shrink-0 items-center justify-center text-xl leading-none"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                )}
            </div>
        </FlashMessageContext>
    );
}

/**
 * Gives access to showMessage. Only usable inside a client component under the provider.
 */
export function useFlashMessage(): FlashMessageContextValue {
    const context = useContext(FlashMessageContext);

    if (!context) {
        throw new Error("useFlashMessage must be used inside a FlashMessageProvider");
    }

    return context;
}
