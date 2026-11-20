import { Suspense } from "react";
import ProjectList from "@/components/Organisms/ProjectList";
import CreateProjectModal from "@/components/Modales/CreateProjectModal";

function ProjectsPage() {
    return(
        <>
            <div className="flex flex-row justify-between pb-16">
                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-2xl font-semibold text-text">Mes projets</h1>
                    <p className="text-lg font-normal text-black">Gérer vos projets</p>
                </div>
                <CreateProjectModal />
            </div>
            <Suspense fallback={<p>Chargement...</p>}>
                <ProjectList />
            </Suspense>
        </>
    );
}

export default ProjectsPage;