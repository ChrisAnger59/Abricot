"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AvatarLinkProps {
    initials: string;
}

export default function AvatarLink({ initials }: AvatarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === "/account";

    return (
        <Link
            href="/account"
            aria-label="Mon Compte"
            aria-current={isActive ? "page" : undefined}
            className={`flex size-16 items-center justify-center rounded-full text-sm ${
                isActive ? "bg-primary text-white" : "bg-primary-light text-dark"
            }`}
        >
            {initials}
        </Link>    
    )
}