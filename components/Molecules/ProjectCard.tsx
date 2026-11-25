import Link from "next/link";
import type { Project } from "@/types/api";
import Avatar from '@/components/Atoms/Avatar';
import ProgressBar from "@/components/Atoms/ProgressBar";
import UserTag from "@/components/Molecules/UserTag";
import { getOtherMembers, type Progress } from "@/lib/utils";

interface ProjectCardProps {
    project: Project;
    // Tasks done out of the tasks of the project, or null if it could not be read
    progress: Progress | null;
}


/**
 * Card of a project in the list: name, description, progress and team.
 *
 * NOTE: GET /projects only gives the total number of tasks (_count.tasks), not how many are done:
 * the progress is computed by the parent from GET /projects/{id} (see getProjectProgress).
 * When it could not be read, the card says so instead of showing a wrong 0 %.
 */
export default function ProjectCard({ project, progress }: ProjectCardProps) {

    // The owner may also appear in members (if added as a contributor):
    // excluded here so that they are not counted twice
    const otherMembers = getOtherMembers(project);

    const teamSize = 1 + otherMembers.length;

    return (
        <article className="flex h-full flex-col gap-6 rounded-card border border-border bg-surface p-6">
            <div className="flex flex-col gap-2">
                <h2 className="font-heading text-lg font-semibold text-black">
                <Link href={`/projects/${project.id}`} className="hover:text-primary">
                    {project.name}
                </Link>
                </h2>
                <p className="text-sm text-text-muted">
                {project.description ?? "Aucune description"}
                </p>
            </div>

            {progress ? (
                <ProgressBar
                    done={progress.done}
                    total={progress.total}
                    label={`Progression du projet ${project.name}`}
                />
            ) : (
                <p className="text-sm text-text-muted">Progression indisponible</p>
            )}

            <div className="mt-auto flex flex-col gap-2">
                <p className="text-xs text-text-muted">Équipe ({teamSize})</p>

                <div className="flex items-center gap-2">
                    <UserTag name={project.owner.name} label="Propriétaire" variant="highlighted" />

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
