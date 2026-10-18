async function ProjectDetailsPage({ params }:{ params: Promise<{id: string}>; }) {
    const { id } = await params;
    return (
        <h1>Projet {id}</h1>
    );
}

export default ProjectDetailsPage;