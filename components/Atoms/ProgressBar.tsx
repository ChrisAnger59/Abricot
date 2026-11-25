import { getProgressPercent } from "@/lib/utils";

interface ProgressBarProps {
    // Number of tasks done
    done: number;
    // Number of tasks that can be done (cancelled ones are not counted)
    total: number;
    // Accessible name of the bar: each bar of a page must say which project it is about
    label: string;
}

/**
 * Progress bar of a project: percentage, bar and "X/Y tâches terminées".
 *
 * The information is never carried by the bar alone: the percentage and the count are written.
 * For screen readers, the bar has its own name (`label`), its value (aria-valuenow) and a
 * sentence (aria-valuetext) that is read instead of the bare number.
 */
export default function ProgressBar({ done, total, label }: ProgressBarProps) {
    const percent = getProgressPercent({ done, total });

    const valueText = total === 0
        ? "Aucune tâche"
        : `${done} ${done > 1 ? "tâches terminées" : "tâche terminée"} sur ${total}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{percent}%</span>
            </div>

            <div
                role="progressbar"
                aria-label={label}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={valueText}
                className="h-2 w-full rounded-full bg-tag"
            >
                <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percent}%` }}
                />
            </div>

            <p className="text-xs text-text-muted">
                {total === 0
                    ? "Aucune tâche"
                    : `${done}/${total} ${total > 1 ? "tâches terminées" : "tâche terminée"}`}
            </p>
        </div>
    )
}
