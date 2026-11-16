import { Suspense } from "react";
import ProjectList from "@/components/Organisms/ProjectList";
import CreateProjectForm from "@/components/Organisms/CreateProjectForm";

function ProjectsPage() {
    return(
        <section>
            <h1>Mes projets</h1>
            <p>Gérer vos projets</p>
            <Suspense fallback={<p>Chargement...</p>}>
                <ProjectList />
            </Suspense>

            <CreateProjectForm />
        </section>
    );
}

export default ProjectsPage;