import UserTag from "@/components/Molecules/UserTag";
import { getOtherMembers } from "@/lib/utils";
import type { Project } from "@/types/api";

interface ProjectContributorsProps {
    project: Project;
}

export default function ProjectContributors({ project }: ProjectContributorsProps) {
    const otherMembers = getOtherMembers(project);
    const teamSize = 1 + otherMembers.length;

    return (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-section px-12 py-6">
            <div className="flex items-baseline gap-2">
                <h2 className="font-heading text-lg font-semibold text-text">Contributeurs</h2>
                <p className="text-text-on-tint">
                    {teamSize} {teamSize > 1 ? "personnes" : "personne"}
                </p>
            </div>

            <ul className="flex flex-wrap items-center gap-2">
                <li>
                    <UserTag name={project.owner.name} label="Propriétaire" variant="highlighted" />
                </li>

                {otherMembers.map((member) => (
                    <li key={member.id}>
                        <UserTag name={member.user.name} label={member.user.name} />
                    </li>
                ))}
            </ul>
        </section>
    );
}