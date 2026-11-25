import { Suspense } from "react";
import CreateProjectModal from "@/components/Modales/CreateProjectModal";
import DashboardGreeting from "@/components/Molecules/DashboardGreeting";
import ViewTabs from "@/components/Molecules/ViewTabs";
import DashboardContent from "@/components/Organisms/DashboardContent";
import type { SearchParams } from "@/lib/utils";

interface DashboardPageProps {
    // Passed down without being awaited: DashboardContent reads it inside a <Suspense>
    searchParams: Promise<SearchParams>;
}

/**
 * Dashboard: welcome sentence, creation of a project, view tabs and the tasks assigned to the user.
 */
function DashboardPage({ searchParams }: DashboardPageProps) {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-2xl font-semibold text-text">Tableau de bord</h1>
                    <Suspense fallback={<p aria-hidden="true" className="min-h-7" />}>
                        <DashboardGreeting />
                    </Suspense>
                </div>
                <CreateProjectModal />
            </div>

            <ViewTabs />

            <Suspense fallback={<p>Chargement...</p>}>
                <DashboardContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

export default DashboardPage;
