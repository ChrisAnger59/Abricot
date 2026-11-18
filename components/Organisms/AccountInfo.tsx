import { getCurrentUser } from "@/lib/user";
import UpdateUserForm from "@/components/Organisms/UpdateUserForm";
import Alert from "@/components/Atoms/Alert";

export default async function AccountInfo() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <Alert>Impossible de récupérer vos informations. Réessayez plus tard.</Alert>
        );
    }

    return (
        <UpdateUserForm user={user} />
    )
}