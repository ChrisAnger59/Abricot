import { apiFetch } from "@/lib/api";
import { getProjectProgress } from "@/lib/projects";
import ProjectCard from "@/components/Molecules/ProjectCard";
import Alert from "@/components/Atoms/Alert";
import type { ProjectsData } from "@/types/api";

/**
 * List of the projects of the signed-in user, with the progress of each one.
 *
 * The progress needs one API call per project (no route gives it for all of them at once).
 * `Promise.all` starts all the calls together and waits for all of them: the waiting time is the
 * one of the slowest call, not the sum of all. Each call answers null on failure, so one project
 * that cannot be read does not prevent the others from being displayed.
 */
export default async function ProjectList() {

    const result = await apiFetch<ProjectsData>("/projects");

    if(!result.success) {
        return (
            <Alert>Impossible de récupérer vos projets. Réessayez plus tard.</Alert>
        );
    }

    const projects = result.data.projects;

    if (projects.length === 0) {
        return (
            <p>Aucun projet pour l&apos;instant. Créez votre premier projet !</p>
        );
    }

    // Same order as `projects`: progresses[i] belongs to projects[i]
    const progresses = await Promise.all(projects.map((project) => getProjectProgress(project.id)));

    return (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
                <li key={project.id}>
                    <ProjectCard project={project} progress={progresses[index]} />
                </li>
            ))}
        </ul>
    )
}
