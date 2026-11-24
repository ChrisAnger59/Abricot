import Avatar from "@/components/Atoms/Avatar";
import { formatCommentDate } from "@/lib/utils";
import type { TaskComment } from "@/types/api";

interface CommentItemProps {
    comment: TaskComment;
}

/**
 * One comment: avatar, author, date and text in a grey bubble, as on the mockup.
 *
 * SECURITY: the text was written by a user and is displayed to others, and the API does not
 * clean it. It is only ever rendered as a React text child (escaped), never as HTML.
 * `whitespace-pre-wrap` keeps the line breaks of the author without turning anything into HTML,
 * and `overflow-wrap:anywhere` breaks very long words instead of overflowing the card.
 */
export default function CommentItem({ comment }: CommentItemProps) {
    return (
        <li className="flex items-start gap-3">
            {/* Decorative: the name is written next to it */}
            <span aria-hidden="true">
                <Avatar name={comment.author.name} />
            </span>

            <div className="min-w-0 flex-1 rounded-card bg-section px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-sm font-semibold text-text">{comment.author.name}</p>
                    {/* dateTime keeps the full machine-readable date and time, the text is shortened */}
                    <time dateTime={comment.createdAt} className="text-xs text-text-on-tint">
                        {formatCommentDate(comment.createdAt)}
                    </time>
                </div>

                <p className="mt-1 text-sm whitespace-pre-wrap text-text [overflow-wrap:anywhere]">
                    {comment.content}
                </p>
            </div>
        </li>
    );
}
