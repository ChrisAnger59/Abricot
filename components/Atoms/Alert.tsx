type AlertVariant = "error" | "success";

// Variant style and behaviour
const ALERT_STYLES: Record<AlertVariant, { className: string; icon: string; role: "alert" | "status" }> = {
    error: {
        className: "border-todo-text bg-todo-bg text-todo-text",
        icon: "⚠",
        role: "alert"
    },
    success: {
        className: "border-done-text bg-done-bg text-done-text",
        icon: "✓",
        role: "status"
    }
};


interface AlertProps {
    // Message to display
    children: React.ReactNode;
    // Message type (default = error or success)
    variant?: AlertVariant;
}

/**
 * Message banner: error or confirmation
 * 
 * - error: read by screen-reader immediatly (role="alert")
 * - success: don't interupt the screen-reader work (role="status")
 */
export default function Alert({ children, variant = "error" }: AlertProps) {
    const style = ALERT_STYLES[variant];

    return (
        <div 
            role={style.role}
            className={`flex items-start gap-3 rounded-btn border px-4 py-3 text-sm ${style.className}`}
        >
            <span aria-hidden="true">{style.icon}</span>
            <p>{children}</p>
        </div>
    );
}