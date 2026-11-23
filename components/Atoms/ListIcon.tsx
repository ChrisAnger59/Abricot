interface IconProps {
    className?: string;
}

/**
 * Checked box, displayed on the "Liste" tab.
 * Decorative: the text next to it carries the meaning.
 */
export default function ListIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={className}
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 12l3 3 5-6" />
        </svg>
    );
}
