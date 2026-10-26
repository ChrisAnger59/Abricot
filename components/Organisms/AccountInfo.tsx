import { getCurrentUser } from "@/lib/user";
import UpdateUserForm from "@/components/Organisms/UpdateUserForm";

export default async function AccountInfo() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <p>Impossible de récupérer vos informations. Réessayez plus tard</p>
        );
    }

    return (
        <UpdateUserForm user={user} />
    )
}