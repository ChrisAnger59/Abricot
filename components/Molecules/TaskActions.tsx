"use client";

import { useId, useRef, useState } from "react";
import DeleteTaskModal from "@/components/Modales/DeleteTaskModal";
import EditTaskModal from "@/components/Modales/EditTaskModal";
import type { TaskFormInitialValues } from "@/components/Organisms/TaskForm";
import type { User } from "@/types/api";

interface TaskActionsProps {
    projectId: string;
    taskId: string;
    // Current values of the task (title included), used by the edit form
    task: TaskFormInitialValues;
    // People the task can be assigned to (the team of the project)
    users: Pick<User, "id" | "name">[];
}

// Which modal is open: a single state instead of two booleans, so two can never be open at once
type OpenModal = "edit" | "delete" | null;

// Space between the "…" button and its menu (in pixels)
const MENU_OFFSET = 4;

/**
 * "…" button of a task card, with its menu (Modifier / Supprimer) and the two modals it opens.
 *
 * The menu uses the native HTML Popover API (`popover` + `popoverTarget`): the browser opens and
 * closes it, closes it with the Escape key or a click outside, and displays it above the rest of
 * the page. No state and no effect for that.
 * The only script is the placement, because a popover is centered in the window by default:
 * when it opens, it is moved under its button.
 */
export default function TaskActions({ projectId, taskId, task, users }: TaskActionsProps) {
    const [openModal, setOpenModal] = useState<OpenModal>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    // Unique id, to link the button to its menu (popoverTarget)
    const menuId = useId();

    // Fired by the browser each time the menu opens or closes
    function handleToggle(event: React.ToggleEvent<HTMLDivElement>) {
        const menu = menuRef.current;
        const button = buttonRef.current;

        if (event.newState !== "open" || !menu || !button) {
            return;
        }

        // Under the button, right edges aligned. Both coordinates are measured from the left and
        // the top, like getBoundingClientRect: a `right` offset would depend on the window width,
        // which differs from the layout width when the page can scroll sideways.
        const rect = button.getBoundingClientRect();
        menu.style.top = `${rect.bottom + MENU_OFFSET}px`;
        menu.style.left = `${Math.max(MENU_OFFSET, rect.right - menu.offsetWidth)}px`;

        // A popover does not follow its button when the page scrolls: close it instead
        window.addEventListener("scroll", () => {
            if (menu.matches(":popover-open")) {
                menu.hidePopover();
            }
        }, { once: true });
    }

    // Closing the menu first gives the focus back to the "…" button, so that the modal,
    // when it closes, returns the focus to a button that is still visible
    function openModalFromMenu(modal: OpenModal) {
        menuRef.current?.hidePopover();
        setOpenModal(modal);
    }

    return (
        <div>
            <button
                ref={buttonRef}
                type="button"
                popoverTarget={menuId}
                aria-label={`Actions de la tâche ${task.title}`}
                className="flex size-11 items-center justify-center rounded-btn border border-border bg-surface text-xl leading-none text-text hover:bg-section"
            >
                <span aria-hidden="true">…</span>
            </button>

            {/* inset-auto and m-0 cancel the default centering of a popover */}
            <div
                ref={menuRef}
                id={menuId}
                popover="auto"
                onToggle={handleToggle}
                className="fixed inset-auto m-0 rounded-btn border border-border bg-surface p-1 shadow-header"
            >
                <ul className="flex flex-col">
                    <li>
                        <button
                            type="button"
                            onClick={() => openModalFromMenu("edit")}
                            className="flex min-h-11 w-full items-center rounded-btn px-4 text-left text-sm text-text hover:bg-section"
                        >
                            Modifier
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => openModalFromMenu("delete")}
                            className="flex min-h-11 w-full items-center rounded-btn px-4 text-left text-sm text-todo-text hover:bg-section"
                        >
                            Supprimer
                        </button>
                    </li>
                </ul>
            </div>

            <EditTaskModal
                isOpen={openModal === "edit"}
                onClose={() => setOpenModal(null)}
                projectId={projectId}
                taskId={taskId}
                task={task}
                users={users}
            />

            <DeleteTaskModal
                isOpen={openModal === "delete"}
                onClose={() => setOpenModal(null)}
                projectId={projectId}
                taskId={taskId}
                taskTitle={task.title}
            />
        </div>
    );
}
