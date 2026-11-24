import { isTaskStatus, MAX_SEARCH_LENGTH, MIN_SEARCH_LENGTH } from "@/lib/validation";
import type { Project, ProjectMember, Task, TaskPriority, TaskStatus, User } from "@/types/api";

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


/**
 * Converts an ISO date to the YYYY-MM-DD text an <input type="date"> expects as its value,
 * e.g. "2026-12-08T00:00:00.000Z" => "2026-12-08".
 *
 * NOTE: the API stores due dates at midnight UTC, so the first 10 characters are already the
 * right day. Going through `new Date` would apply the local time zone and could give the day before.
 */
export function toDateInputValue(isoDate: string): string {
    return isoDate.slice(0, 10);
}


// Comment dates are displayed in the time zone of Paris, whoever reads them. A fixed zone gives
// the same text on the server and in the browser (no hydration mismatch) and keeps the date in a
// server component. Limit: a reader in another time zone sees the time in Paris.
const COMMENT_DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris"
});

const COMMENT_TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    // h23: 00:05 and not 24:05 at midnight
    hourCycle: "h23",
    timeZone: "Europe/Paris"
});

/**
 * Formats the date and time of a comment as on the mockup,
 * e.g. "2026-03-23T10:20:00.000Z" => "23 mars, 11:20".
 *
 * The year is not displayed (as for due dates): the `dateTime` attribute of <time> keeps it.
 * Two formatters assembled with ", ", because a single one would write "23 mars à 11:20".
 */
export function formatCommentDate(isoDate: string): string {
    const date = new Date(isoDate);

    return `${COMMENT_DATE_FORMAT.format(date)}, ${COMMENT_TIME_FORMAT.format(date)}`;
}


/** The `searchParams` prop of a page: values of the URL query string, as received by Next */
export type SearchParams = { [key: string]: string | string[] | undefined };

/** Filters applied to the tasks of a project, read from the URL */
export interface TaskFilters {
    // Text searched in the titles; "" means no search
    query: string;
    // Status to keep; null means every status
    status: TaskStatus | null;
}


/**
 * Reads the filters of the task list from the URL parameters (?query=...&status=...).
 *
 * The URL can be edited by hand, so nothing is trusted:
 * - a parameter given twice (?query=a&query=b) arrives as an array: only the first value is kept;
 * - the search text is trimmed and cut to MAX_SEARCH_LENGTH characters;
 * - below MIN_SEARCH_LENGTH characters, the search is ignored (same rule as the search field);
 * - a status that is not one of the task statuses is ignored.
 * Invalid values never raise an error: they just mean "no filter".
 *
 * The values are only used to compare texts, never to build HTML.
 */
export function parseTaskFilters(searchParams: SearchParams): TaskFilters {
    const rawQuery = getFirstValue(searchParams.query).trim().slice(0, MAX_SEARCH_LENGTH);
    const rawStatus = getFirstValue(searchParams.status);

    return {
        query: rawQuery.length >= MIN_SEARCH_LENGTH ? rawQuery : "",
        status: isTaskStatus(rawStatus) ? rawStatus : null,
    };
}

/** First value of a URL parameter, or "" if it is missing */
function getFirstValue(value: string | string[] | undefined): string {
    return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}


/**
 * Prepares a text for a comparison that ignores case and accents:
 * "Tâche" and "tache" give the same result.
 *
 * `normalize("NFD")` splits an accented letter into the letter and its accent ("é" => "e" + "´"),
 * then the regular expression removes the accents (the "combining diacritical marks" range).
 */
export function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


/**
 * Keeps the tasks that match the filters: the status (if any) AND the search text (if any)
 * in the title. The search is the whole phrase typed by the user, not each word separately.
 *
 * `filter` builds a new array and leaves the original untouched.
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    const searchedText = normalizeText(filters.query);

    return tasks.filter((task) => {
        const matchesStatus = filters.status === null || task.status === filters.status;
        const matchesQuery = searchedText === "" || normalizeText(task.title).includes(searchedText);

        return matchesStatus && matchesQuery;
    });
}
