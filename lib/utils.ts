export default function getInitials(username: string): string {
    const cleanName = username.trim();

    if (cleanName === "") {
        return '?';
    }

    const words = cleanName.split(/\s+/);
    const firstInitial = words[0][0];

    if (words.length === 1) {
        return firstInitial.toUpperCase();
    }

    const lastInitial = words[words.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
}