import { apiFetch } from "@/lib/api";
import type { ProfileData } from "@/types/api";

export default async function AccountInfo() {
    const result = await apiFetch<ProfileData>("/auth/profile");

    if (!result.success) {
        return (
            <p>Impossible de récupérer vos informations</p>
        );
    }

    const { user } = result.data;

    return (
        <div>
            <p>Nom: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}