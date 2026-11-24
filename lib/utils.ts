import type { Project, ProjectMember, Task, TaskPriority, User } from "@/types/api";

/**
 * Computes the initials shown in an avatar.
 *
 * First letter of the first word + first letter of the last word,
 * so we always get 2 letters whatever the number of words (several names, compound names, etc.).
 *
 * @param username - The user's full name
 * @returns - The initials in uppercase, or "?" if the name is empty
 *
 * @example - getInitials("Alice Dupont") => AD
 * @example - getInitials("jean pierre dupont") => JD
 * @example - getInitials("Alice") => A
 * @example - getInitials("") => ?
 */
export function getInitials(username: string): string {
    const cleanName = username.trim();

    // Must be tested before splitting: on an empty text, words[0][0] would be undefined
    if (cleanName === "") {
        return '?';
    }

    // /\s+/ splits on one or more spaces: avoids empty words
    // when the name contains multiple spaces ("Alice   Dupont")
    const words = cleanName.split(/\s+/);
    const firstInitial = words[0][0];

    // Single word: first and last word are the same, otherwise "Alice" would give "AA"
    if (words.length === 1) {
        return firstInitial.toUpperCase();
    }

    const lastInitial = words[words.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
}


/**
 * Returns the project members other than its owner.
 *
 * NOTE: the owner may also appear in `members` (if added as a contributor),
 * so the team is always "owner + getOtherMembers(project)" to avoid counting them twice.
 */
export function getOtherMembers(project: Project): ProjectMember[] {
    return project.members.filter((member) => member.userId !== project.ownerId);
}


/**
 * Returns the whole team of a project as plain users: the owner first, then the other members.
 * Used to choose the people a task can be assigned to (the API accepts the owner as assignee).
 */
export function getTeamUsers(project: Project): User[] {
    return [project.owner, ...getOtherMembers(project).map((member) => member.user)];
}


/** Sort rank of each priority: the lower the number, the more urgent the task. */
const PRIORITY_RANK: Record<TaskPriority, number> = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
};

/**
 * Sorts tasks from the most urgent to the least urgent.
 *
 * NOTE: the API sorts with `orderBy priority desc` on a text column, which gives an
 * alphabetical order (URGENT, MEDIUM, LOW, HIGH) instead of an order by severity.
 * We therefore sort on our side, with an explicit rank.
 *
 * Works on a copy ([...tasks]) because `sort` modifies the array it is called on.
 * `sort` is stable: tasks with the same priority keep the API order (most recent first).
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
}


/**
 * Formats an ISO date for display, e.g. "2026-12-08T00:00:00.000Z" => "8 décembre".
 *
 * NOTE: the API stores due dates at midnight UTC. Without `timeZone: "UTC"`, a negative
 * UTC offset would display the previous day.
 * The year is not displayed (as on the mockup): the `dateTime` attribute of <time> keeps the full date.
 */
export function formatDueDate(isoDate: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        timeZone: "UTC"
    }).format(new Date(isoDate));
}
