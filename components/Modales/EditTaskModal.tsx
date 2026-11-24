"use client";

import Modal from "@/components/Modales/Modal";
import TaskForm, { type TaskFormInitialValues } from "@/components/Organisms/TaskForm";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { updateTask } from "@/lib/actions/tasks";
import type { User } from "@/types/api";

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string;
    // Current values of the task, displayed in the form
    task: TaskFormInitialValues;
    // People the task can be assigned to (the team of the project)
    users: Pick<User, "id" | "name">[];
}

/**
 * Modal containing the form to edit a task, filled with its current values.
 * The parent (TaskActions) owns the open/closed state, since the same card also has a delete modal.
 */
export default function EditTaskModal({ isOpen, onClose, projectId, taskId, task, users }: EditTaskModalProps) {
    const { showMessage } = useFlashMessage();

    function handleSuccess(message: string) {
        onClose();
        showMessage(message);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier la tâche">
            <TaskForm
                action={updateTask.bind(null, projectId, taskId)}
                users={users}
                initialValues={task}
                submitLabel="Enregistrer"
                pendingLabel="Enregistrement…"
                onSuccess={handleSuccess}
            />
        </Modal>
    );
}
