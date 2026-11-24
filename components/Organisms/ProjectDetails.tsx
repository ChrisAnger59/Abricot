import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getTeamUsers, parseTaskFilters, type SearchParams } from "@/lib/utils";
import CreateTaskModal from "@/components/Modales/CreateTaskModal";
import Alert from "@/components/Atoms/Alert";
import ArrowLeftIcon from "@/components/Atoms/ArrowLeftIcon";
import ProjectContributors from "@/components/Molecules/ProjectContributors";
import TaskList from "@/components/Organisms/TaskList";
import type { ProjectData, TasksData } from "@/types/api";

interface ProjectDetailsProps {
    params: Promise<{ id: string }>;
    // Query string of the URL (?query=...&status=...), a promise like `params`
    searchParams: Promise<SearchParams>;
}

/**
 * Content of the project page: header, contributors and tasks.
 *
 * Awaits `params` and `searchParams` itself: the page passes them down without awaiting them,
 * so this component is covered by the loading.tsx boundary.
 */
export default async function ProjectDetails({ params, searchParams }: ProjectDetailsProps) {
    const { id } = await params;
    // The filters of the task list; invalid values in the URL simply mean "no filter"
    const filters = parseTaskFilters(await searchParams);
    const result = await apiFetch<ProjectData>(`/projects/${id}`);

    if (!result.success) {
        // NOTE: the API returns 403 FORBIDDEN both for a missing and for an inaccessible project
        if (result.error === "FORBIDDEN") {
            notFound();
        }

        return <Alert>Impossible de récupérer ce projet. Réessayez plus tard.</Alert>
    }

    const { project } = result.data;
    // NOTE: the tasks of GET /projects/{id} are simplified (no assignees, no comments),
    // hence this second call for the full tasks
    const tasksResult = await apiFetch<TasksData>(`/projects/${id}/tasks`);

    // Only id and name go to the client components: no need to send e-mails to the browser
    const teamUsers = getTeamUsers(project).map((user) => ({ id: user.id, name: user.name }));

    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link
                        href="/projects"
                        aria-label="Retour aux projets"
                        className="flex size-11 shrink-0 items-center justify-center rounded-btn border border-border bg-surface text-text hover:bg-section"
                    >
                        <ArrowLeftIcon className="size-5" />
                    </Link>

                    <div className="flex flex-col gap-2">
                        <h1 className="font-heading text-2xl font-semibold text-text">{project.name}</h1>
                        <p className="text-text-muted">{project.description ?? "Aucune description"}</p>
                    </div>
                </div>

                <CreateTaskModal projectId={project.id} users={teamUsers} />
            </section>

            <ProjectContributors project={project} />

            {/* An error on the tasks does not prevent displaying the rest of the project */}
            {tasksResult.success ? (
                <TaskList tasks={tasksResult.data.tasks} users={teamUsers} filters={filters} />
            ) : (
                <Alert>Impossible de récupérer les tâches de ce projet. Réessayez plus tard.</Alert>
            )}
        </div>
    );
}
