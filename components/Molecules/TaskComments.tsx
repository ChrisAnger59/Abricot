import ChevronDownIcon from "@/components/Atoms/ChevronDownIcon";
import CommentItem from "@/components/Molecules/CommentItem";
import CommentForm from "@/components/Organisms/CommentForm";
import type { TaskComment } from "@/types/api";

interface TaskCommentsProps {
    projectId: string;
    taskId: string;
    taskTitle: string;
    // Comments of the task, from the oldest to the most recent (the order of the API)
    comments: TaskComment[];
    // Name of the signed-in user, for the avatar of the form
    currentUserName: string;
}

/**
 * "Commentaires (n)" part of a task card: a native <details> that unfolds the comments and the
 * form to add one.
 *
 * Server component: the list is rendered on the server, so nothing about the authors (e-mails
 * included, which the API sends) reaches the browser. Only the form is a client component.
 * The open state belongs to the <details> element itself: it is not controlled by React, so it
 * survives the refresh that follows a new comment.
 * The count and the list come from the same array: they cannot disagree.
 */
export default function TaskComments({ projectId, taskId, taskTitle, comments, currentUserName }: TaskCommentsProps) {
    return (
        <details className="group border-t border-border pt-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm text-text [&::-webkit-details-marker]:hidden">
                Commentaires ({comments.length})
                <ChevronDownIcon className="size-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
            </summary>

            <div className="mt-4 flex flex-col gap-4">
                {comments.length > 0 && (
                    <ul className="flex flex-col gap-3">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </ul>
                )}

                <CommentForm
                    projectId={projectId}
                    taskId={taskId}
                    taskTitle={taskTitle}
                    currentUserName={currentUserName}
                />
            </div>
        </details>
    );
}
