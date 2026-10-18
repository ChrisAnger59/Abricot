import Link from 'next/link';

function NotFoundPage() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center gap-4 bg-page px-4 text-center'>
            <p className="font-heading text-6xl text-primary">404</p>
            <h1 className='text-2xl'>Page introuvable</h1>

            <Link href="/dashboard" className='mt-4 rounded-btn bg-dark px-6 py-3 text-sm text-white'>
                Retour au tableau de bord
            </Link>
        </main>
    );
}

export default NotFoundPage;