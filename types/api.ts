// Types describing the data exchanged with the API
// Built from the real API responses (Swagger and Postman tests)

/**
 * User returned by the API.
 * The password is never returned.
 */
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Validation error about one specific form field
 * e.g. { field: "email", message: "Format d'email invalide" }
 */
export interface FieldError {
    field: string;
    message: string;
}

/**
 * Successful API response.
 * The structure is always the same, only the content of "data" changes depending on the route.
 * T is the shape of data, specified at each use.
 *
 * @example - ApiSuccess<ProfileData> => data contains { user }
 */
export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}


/**
 * Failed API response.
 * Validation errors come from the API in data.errors
 */
export interface ApiError {

    success: false;

    /** Message meant for the user (e.g. "Email ou mot de passe incorrect") */
    message: string;

    /** Stable technical code, to be tested in the code (e.g. "EMAIL_ALREADY_EXISTS") */
    error: string;

    /** Only present for validation errors (400) */
    data?: {
        errors: FieldError[];
    }
}


/**
 * API responses: succeeded or failed.
 * Testing "result.success" lets TypeScript know which case we are in.
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;


/**
 * Content of data for "POST /auth/login" and "POST /auth/register"
 */
export interface AuthData {
    user: User;
    token: string;
}


/**
 * Content of data for "GET /auth/profile" and "PUT /auth/profile"
 * The user is in data.user
 */
export interface ProfileData {
    user: User;
}


/**
 * State of a form, managed by useActionState.
 *
 * What the Server Actions (login, register, createProject, createTask, ...) return when
 * the submission fails and what the form displays. Empty ({}) on first render.
 */
export interface FormState {

    /** General error, not tied to a field (e.g. wrong credentials, unreachable server) */
    message?: string;

    /** Errors by field, indexed by field name (e.g. { password: "..." }) */
    fieldErrors?: Record<string, string>;

    /** Entered values to display again after an error (never the password) */
    values?: Record<string, string>;

    /** Confirmation message, after a successful update */
    success?: string;
}


/** Role of a user in a project */
export type ProjectRole = "ADMIN" | "CONTRIBUTOR";

/** Project member: the user is nested in user */
export interface ProjectMember {
    id: string;
    role: ProjectRole;
    joinedAt: string;
    userId: string;
    projectId: string;
    user: User;
}

/**
 * Project as returned by the API.
 * NOTE: the full team = owner + members (the owner is not automatically a member).
 */
export interface Project {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: User;
    members: ProjectMember[];
    _count: {
        tasks: number;
    };
    userRole?: ProjectRole;
}

/** Content of data for GET /projects */
export interface ProjectsData {
    projects: Project[]
}

/** Content of data for POST /projects and GET /projects/{id} */
export interface ProjectData {
    project: Project;
}

/** Content of data for GET /users/search */
export interface UsersData {
    users: User[];
}


export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/** User assigned to a task */
export interface TaskAssignee {
    id: string;
    assignedAt: string;
    user: User;
}

/** Content of data for GET /projects/{id}/tasks */
export interface TasksData {
    tasks: Task[];
}

/** Content of data for POST /projects/{id}/tasks and PUT /projects/{id}/tasks/{taskId} */
export interface TaskData {
    task: Task;
}

/**
 * Simplified task, as returned inside `project.tasks` by GET /projects/{id} (checked with real
 * calls): no assignees, no comments, no `project`. It has every task of the project and its status,
 * which is all the progress of a project needs.
 */
export interface TaskSummary {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    creatorId: string;
    creator: User;
}

/**
 * Task assigned to the signed-in user, as returned by GET /dashboard/assigned-tasks
 * (checked with a real call). Same as Task, except for two fields:
 * - no `creator` (the route does not include it);
 * - `project` also has the description of the project.
 * `Omit<Task, ...>` takes every field of Task except the ones listed.
 */
export interface AssignedTask extends Omit<Task, "creator" | "project"> {
    project: {
        id: string;
        name: string;
        description: string | null;
    };
}

/** Content of data for GET /dashboard/assigned-tasks */
export interface AssignedTasksData {
    tasks: AssignedTask[];
}

/** Project with all its (simplified) tasks, as returned by GET /projects/{id} */
export interface ProjectWithTasksData {
    project: Project & { tasks: TaskSummary[] };
}

/**
 * Full task, as returned by GET /projects/{id}/tasks.
 * NOTE: dueDate is an ISO date at midnight UTC (e.g. "2026-12-08T00:00:00.000Z").
 */
export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    creatorId: string;
    creator: User;
    project: {
        id: string;
        name: string;
    }
    assignees: TaskAssignee[];
    comments: TaskComment[];
}

/**
 * Task comment, as returned inside the tasks of GET /projects/{id}/tasks
 * (checked with real calls). They come from the oldest to the most recent.
 *
 * NOTE: unlike the Swagger and unlike the response of POST .../comments, there is no `taskId`
 * and no `authorId` here: the author is only available through `author`.
 */
export interface TaskComment {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}

/**
 * Content of data for POST /projects/{id}/tasks/{taskId}/comments.
 * Richer than TaskComment (it also has taskId, authorId and the task), but the front only
 * needs to know that the comment was created: the list is read again with the tasks.
 */
export interface CommentData {
    comment: TaskComment & {
        taskId: string;
        authorId: string;
        task: { id: string; title: string };
    };
}
