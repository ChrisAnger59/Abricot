import { getCurrentUser } from "@/lib/user";

/**
 * Welcome sentence of the dashboard, with the name of the signed-in user.
 *
 * Async server component: reading the user depends on the cookie of the request, so the page wraps
 * it in <Suspense>. getCurrentUser returns null when the profile is unavailable: the sentence then
 * simply has no name, and the page still works.
 */
export default async function DashboardGreeting() {
    const user = await getCurrentUser();

    return (
        <p className="text-lg font-normal text-black">
            {user ? `Bonjour ${user.name}, voici` : "Voici"} un aperçu de vos projets et tâches
        </p>
    );
}
