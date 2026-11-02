import { apiFetch } from "@/lib/api";
import ProjectCard from "../Molecules/ProjectCard";
import type { ProjectsData } from "@/types/api";

export default async function ProjectList() {

    const result = await apiFetch<ProjectsData>("/projects");

    if(!result.success) {
        return (
            <p>Impossible de récupérer vos projets. Réessayez plus tard.</p>
        );
    }

    const projects = result.data.projects;

    if (projects.length === 0) {
        return (
            <p>Aucun projet pour l'instant. Créez votre premier projet !</p>
        );
    }

    return (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <li key={project.id}>
                    <ProjectCard project={project} />
                </li>
            ))}
        </ul>
    )
}