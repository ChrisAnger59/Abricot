import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/components/Atoms/Logo"
import NavLink from '@/components/Atoms/NavLink';
import DashboardIcon  from '@/components/Atoms/DashboardIcon';
import ProjectIcon from '@/components/Atoms/ProjectsIcon';
import UserAvatar from "@/components/Molecules/UserAvatar";

function Header() {
    return(
        <header className="bg-surface shadow-header p-8">
            <nav className="flex items-center justify-between px-16">
                <Link href="/dashboard"><Logo /></Link>
                
                <div className="flex gap-8">
                    <NavLink href="/dashboard">
                        <DashboardIcon className="size-6" />
                        Tableau de Bord
                    </NavLink>

                    <NavLink href="/projects">
                        <ProjectIcon className="size-6" />
                        Projets
                    </NavLink>
                </div>

                <Suspense fallback={
                    <div className="size-16 rounded-full bg-primary-light" />
                }>
                    <UserAvatar />
                </Suspense>
            </nav>
        </header>
    );
}

export default Header;