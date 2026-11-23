import Link from "next/link";

interface NavLinkBaseProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

/**
 * Navigation link display, active or not
 * Without hook: can also be waiting content (Suspense) as the current page is not known
 */
export default function NavLinkBase({ href, children, isActive }: NavLinkBaseProps) {
    return (
        <Link 
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-btn px-12 py-4 text-sm ${isActive ? "bg-dark text-white" : "text-primary"}`}
        >
            {children}
        </Link>
    );
}