import ProjectDetails from '@/components/Organisms/ProjectDetails';

export default function ProjectPage({ params }:{ params: Promise<{id: string}>; }) {

    return (
        <ProjectDetails params={params} />
    );
}