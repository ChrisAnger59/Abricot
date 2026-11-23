interface IconProps {
    className?: string;
}

/**
 * Downward chevron, shown on dropdown-like controls.
 * Decorative: the control carries the accessible name.
 */
export default function ChevronDownIcon({ className }: IconProps) {
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
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}
