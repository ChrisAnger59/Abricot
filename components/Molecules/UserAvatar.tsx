import { getCurrentUser } from "@/lib/user";
import AvatarLink from "@/components/Molecules/AvatarLink";

export default async function UserAvatar() {
    const user = await getCurrentUser();
    const name = user ? user.name : "";

    return (
        <AvatarLink name={name} />
    );
}