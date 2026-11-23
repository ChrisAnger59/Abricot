import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <section className="flex flex-col items-start gap-4">
            <h1 className="font-heading text-2xl font-semibold">Projet Introuvable</h1>
            <p className="text-text-muted">Ce projet n&apos;existe pas, ou vous n&apos;y avez pas accès.</p>

            <Link href="/projects" className="rounded-btn bg-dark px-6 py-3 text-sm text-white">
                Retour à mes projets
            </Link>
        </section>
    );
}