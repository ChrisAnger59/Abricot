import { getInitials } from '@/lib/utils'

type AvatarSize = "small" | "large";
type AvatarVariant = "default" | "highlighted" | "active";

const AVATAR_SIZES: Record<AvatarSize, string> = {
    small: "size-7 text-[10px]",
    large: "size-16 text-sm"
};

const AVATAR_VARIANTS: Record<AvatarVariant, string> = {
    default: "bg-tag text-text",
    highlighted: "bg-primary-light text-dark",
    active: "bg-primary text-white"
}

interface AvatarProps {
    name: string;
    size?: AvatarSize;
    variant?: AvatarVariant; 
}


/**
 * Cercle affichant les initiales d'une personne.
 * Le nom complet est transmis aux lecteurs d'écran via aria-label.
 */
export default function Avatar({ name, size = "small", variant = "default" }: AvatarProps) {

    const label = name || "Utilisateur inconnu";

    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className={`flex items-center justify-center rounded-full ${AVATAR_SIZES[size]} ${AVATAR_VARIANTS[variant]}`}
        >
            {getInitials(name)}
        </span>
    );
}

