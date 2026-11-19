interface ProgressBarProps {
    // Number of tasks done
    done: number;
    // Number of tasks
    total: number;
}

/**
 * Progress Bar
 *  
 */
export default function ProgressBar({ done, total }: ProgressBarProps) {
    // A taskless project will be 0 / 0 = NaN, 0% in that case
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{percent}%</span>
            </div>

            <div
                role="progressbar"
                aria-label="Progression du projet"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full rounded-full bg-tag"
            >
                <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percent}%` }}
                />
            </div>

            <p className="text-xs text-text-muted">
                {done}/{total} {total > 1 ? "tâches terminées" : "tâche terminée"}
            </p>
        </div>
    )
}