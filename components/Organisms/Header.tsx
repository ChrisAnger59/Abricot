import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/components/Atoms/Logo"
import NavLink from '@/components/Atoms/NavLink';
import NavLinkBase from "@/components/Atoms/NavLinkBase";
import DashboardIcon  from '@/components/Atoms/DashboardIcon';
import ProjectIcon from '@/components/Atoms/ProjectsIcon';
import UserAvatar from "@/components/Molecules/UserAvatar";

function Header() {
    return(
        <header className="bg-surface shadow-header p-8">
            <nav className="flex items-center justify-between px-16">
                <Link href="/dashboard"><Logo /></Link>
                
                <div className="flex gap-8">
                    <Suspense 
                        fallback={
                            <NavLinkBase href="/dashboard" isActive={false}>
                                <DashboardIcon className="size-6" />
                                Tableau de bord
                            </NavLinkBase>
                        }
                    >
                        <NavLink href="/dashboard">
                            <DashboardIcon className="size-6" />
                            Tableau de bord
                        </NavLink>
                    </Suspense>

                    <Suspense
                        fallback={
                            <NavLinkBase href="/projects" isActive={false}>
                                <ProjectIcon className="size-6" />
                                Projets
                            </NavLinkBase>
                        }
                    >
                        <NavLink href="/projects">
                            <ProjectIcon className="size-6" />
                            Projets
                        </NavLink>
                    </Suspense>
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