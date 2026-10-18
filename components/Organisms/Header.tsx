import Link from "next/link";
import Logo from "@/components/Atoms/Logo"

function Header() {
    return(
        <header className="bg-surface shadow-header p-8">
            <nav className="flex items-center justify-between px-16">
                <Link href="/dashboard"><Logo /></Link>
                
                <div className="flex gap-8">
                    <Link href="/dashboard">Tableau de bord</Link>
                    <Link href="/projects">Les Projets</Link>
                </div>

                <Link href="/account">AD</Link>
            </nav>
        </header>
    );
}

export default Header;