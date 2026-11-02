import Link from "next/link";
import type { Project } from "@/types/api";
import Avatar from '@/components/Atoms/Avatar';

interface ProjectCardProps {
    project: Project;
}


/**
 * Carte d'un projet dans la liste : nom, description, nombre de tâches et équipe.
 *
 * NOTE : l'API ne fournit que le nombre total de tâches (_count.tasks),
 * pas le nombre de tâches terminées : la progression de la maquette n'est pas affichable.
 */
export default function ProjectCard({ project }: ProjectCardProps) {

    // Le propriétaire peut aussi figurer dans members (s'il s'est ajouté comme contributeur) :
    // on l'exclut pour ne pas le compter deux fois
    const otherMembers = project.members.filter(
        (member) => member.userId !== project.ownerId
    );

    const teamSize = 1 + otherMembers.length;
    const taskCount = project._count.tasks;

    return (
        <article className="flex h-full flex-col gap-6 rounded-card border border-border bg-surface p-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-lg">
                <Link href={`/projects/${project.id}`} className="hover:text-primary">
                    {project.name}
                </Link>
                </h2>
                <p className="text-sm text-text-muted">
                {project.description ?? "Aucune description"}
                </p>
            </div>

            <p className="text-xs text-text-muted">
                {taskCount} {taskCount > 1 ? "tâches" : "tâche"}
            </p>

            <div className="mt-auto flex flex-col gap-2">
                <p className="text-xs text-text-muted">Équipe ({teamSize})</p>

                <div className="flex items-center gap-2">
                    <Avatar name={project.owner.name} variant="highlighted" />
                    <span className="rounded-full bg-primary-light px-3 py-0.5 text-xs text-primary">
                    Propriétaire
                    </span>

                    <div className="flex -space-x-1">
                        {otherMembers.map((member) => (
                        <Avatar key={member.id} name={member.user.name} />
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}