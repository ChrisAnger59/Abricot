import { getCurrentUser } from "@/lib/user";

export default async function AccountInfo() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <p>Impossible de récupérer vos informations</p>
        );
    }

    return (
        <div>
            <p>Nom: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}