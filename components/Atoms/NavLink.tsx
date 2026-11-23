"use client";

import { usePathname } from "next/navigation";
import NavLinkBase from "@/components/Atoms/NavLinkBase";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

/**
 * Navigation Link, detects if match the current page
 * usePathname is a request data: must be in <Suspense>
 */
export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <NavLinkBase href={href} isActive={isActive}>
            {children}
        </NavLinkBase>
    );
}