"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@/components/Atoms/Avatar';

interface AvatarLinkProps {
    name: string;
}

export default function AvatarLink({ name }: AvatarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === "/account";

    return (
        <Link
            href="/account"
            aria-label="Mon compte"
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center justify-center rounded-full`}
        >
            <Avatar name={name} size="large" variant={isActive ? "active" : "highlighted"} />
        </Link>    
    )
}