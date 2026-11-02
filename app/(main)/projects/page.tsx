import { Suspense } from "react";
import ProjectList from "@/components/Organisms/ProjectList";

function ProjectsPage() {
    return(
        <section>
            <h1>Mes projets</h1>
            <p>Gérer vos projets</p>
            <Suspense fallback={<p>Chargement...</p>}>
                <ProjectList />
            </Suspense>
        </section>
    );
}

export default ProjectsPage;