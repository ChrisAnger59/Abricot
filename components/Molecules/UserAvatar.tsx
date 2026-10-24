import { getCurrentUser } from "@/lib/user";
import getInitials from "@/lib/utils";
import AvatarLink from "../Atoms/AvatarLink";

export default async function UserAvatar() {
    const user = await getCurrentUser();
    const initials = user ? getInitials(user.name) : "?";

    return (
        <AvatarLink initials={initials} />
    );
}