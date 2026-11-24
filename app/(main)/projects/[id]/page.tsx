import ProjectDetails from '@/components/Organisms/ProjectDetails';
import type { SearchParams } from '@/lib/utils';

/**
 * Project page. `params` and `searchParams` are passed down without being awaited:
 * ProjectDetails awaits them, under the loading.tsx boundary.
 */
export default function ProjectPage({ params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<SearchParams>;
}) {

    return (
        <ProjectDetails params={params} searchParams={searchParams} />
    );
}
