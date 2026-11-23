import Avatar from "@/components/Atoms/Avatar";

type UserTagVariant = "default" | "highlighted";

// Tags ClassNames 
const LABEL_STYLES: Record<UserTagVariant, string> = {
    default: "bg-tag text-text-on-tint",
    highlighted: "bg-primary-light text-primary-text"
};

interface UserTagProps {
    // Person's name (avatar and initals)
    name: string;
    // Tags text: name, role
    label: string;
    variant?: UserTagVariant;
}

export default function UserTag({ name, label, variant = "default" }: UserTagProps) {
    return (
        <span className="flex items-center gap-1">
            <span aria-hidden="true">
                <Avatar name={name} variant={variant} />
            </span>

            <span className={`rounded-full px-3 py-0.5 text-sm ${LABEL_STYLES[variant]}`}>
                {label !== name && <span className="sr-only">{name}, </span>}
                {label}
            </span>
        </span>
    );
}