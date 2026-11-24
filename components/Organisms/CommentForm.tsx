"use client";

import { useActionState, useId } from "react";
import Alert from "@/components/Atoms/Alert";
import Avatar from "@/components/Atoms/Avatar";
import TextAreaField from "@/components/Atoms/TextAreaField";
import { useFlashMessage } from "@/components/Providers/FlashMessageProvider";
import { addComment } from "@/lib/actions/comments";
import { COMMENT_MAX_LENGTH } from "@/lib/validation";
import type { FormState } from "@/types/api";

interface CommentFormProps {
    projectId: string;
    taskId: string;
    // Used in the (hidden) label, so that every comment field of the page has its own name
    taskTitle: string;
    // Name of the signed-in user, for the avatar
    currentUserName: string;
}

const initialState: FormState = {};

/**
 * Form to add a comment to a task: avatar of the signed-in user, text area and "Envoyer" button.
 *
 * The text area is uncontrolled (`defaultValue`): React empties it by itself after a successful
 * submission, and it keeps what was typed when the server answers with an error.
 * The confirmation goes through the shared message (FlashMessageProvider), so it is announced
 * to screen readers: the new comment appearing in the list is not announced by itself.
 * The ids are bound to the action inside the wrapper below, see addCommentAndNotify.
 */
export default function CommentForm({ projectId, taskId, taskTitle, currentUserName }: CommentFormProps) {
    const { showMessage } = useFlashMessage();
    // Unique id: there is one comment form per task card
    const fieldId = useId();

    // Wrapper around the Server Action: the message is shown here, once the action has answered,
    // and not in a useEffect. If the task was deleted elsewhere, the action refreshes the page and
    // this card (with its form) disappears in the same update: an effect would never run.
    // The provider, in the layout, stays mounted.
    async function addCommentAndNotify(prevState: FormState, formData: FormData): Promise<FormState> {
        const result = await addComment(projectId, taskId, prevState, formData);

        if (result.success) {
            showMessage(result.success);
        }

        return result;
    }

    const [state, formAction, isPending] = useActionState(addCommentAndNotify, initialState);

    return (
        <form action={formAction} className="flex items-start gap-3">
            {/* Decorative: the field has its own label */}
            <span aria-hidden="true">
                <Avatar name={currentUserName} />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <TextAreaField
                    id={fieldId}
                    label={`Ajouter un commentaire à la tâche ${taskTitle}`}
                    hideLabel
                    name="content"
                    rows={2}
                    maxLength={COMMENT_MAX_LENGTH}
                    placeholder="Ajouter un commentaire..."
                    defaultValue={state.values?.content}
                    error={state.fieldErrors?.content}
                />

                {state.message && <Alert>{state.message}</Alert>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="min-h-11 self-end rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
                >
                    {isPending ? "Envoi…" : "Envoyer"}
                </button>
            </div>
        </form>
    );
}
