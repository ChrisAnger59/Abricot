import Link from 'next/link';
import Logo from '@/components/Atoms/Logo';

function Footer() {
    return (
        <footer className="bg-surface shadow-header p-3">
            <nav className="flex items-center justify-between px-6">
                <Link href="/dashboard"><Logo color="black"/></Link>

                <p>Abricot 2026</p>
            </nav>
        </footer>
    );
}

export default Footer;