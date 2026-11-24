/**
 * Preparation and validation of form data
 *
 * Validation is done in the Server Actions (login, register, etc.) before any call to the API,
 * to avoid a useless request when the data is invalid.
 * The rules and messages repeat those of the API:
 * the user sees the same text, whether the error is detected here or by the API.
 *
 * No "use server": these are ordinary functions.
 * In a "use server" file, only async Server Actions can be exported.
 */

import type { TaskStatus } from "@/types/api";

// API message for any password rule that is not met
const PASSWORD_RULES_MESSAGE = "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&)"

// Simplified email format: text@text.text, without spaces
// Checks the overall shape, the API remains the judge
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Task limits, the same as the API's
const TASK_TITLE_MIN_LENGTH = 2;
const TASK_TITLE_MAX_LENGTH = 200;
const TASK_DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Statuses the user can choose in the task form, in display order.
 * CANCELLED exists in the API but is not on the mockups: the form only offers it
 * for a task that already has it (see StatusPicker).
 */
export const TASK_FORM_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

/** Every status the API accepts: the form statuses plus CANCELLED */
const VALID_TASK_STATUSES: readonly string[] = [...TASK_FORM_STATUSES, "CANCELLED"];

/** Date sent by an <input type="date">: always YYYY-MM-DD, whatever the displayed format */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Minimal number of characters before any search or filtering starts (client and server) */
export const MIN_SEARCH_LENGTH = 3;

/** A search text longer than this is cut: nobody types more, and the URL stays reasonable */
export const MAX_SEARCH_LENGTH = 100;

/**
 * Type guard: tells TypeScript that a text is one of the task statuses.
 * Used for values that come from the URL, which anybody can edit by hand.
 */
export function isTaskStatus(value: string): value is TaskStatus {
    return VALID_TASK_STATUSES.includes(value);
}


/**
 * Gets the value of a form field, always as text.
 *
 * formData.get can return null (missing field) or a file (input of type file).
 * This function guarantees a string, possibly empty.
 *
 * @param formData - The data sent by the form
 * @param key - The name attribute of the field
 * @param trim - Removes the spaces at the start and end (true by default) / to disable for a password
 * @returns - The value of the field, or "" if it is missing or is not text
 */
export function getString(formData: FormData, key: string, trim = true): string {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return trim ? value.trim() : value;
}


/**
 * Checks the registration form data.
 *
 * @param email - Value of the field name="email" of the form
 * @param password - Value of the field name="password" of the form
 * @param name - Value of the field name="name" of the form
 * @returns - An errors object indexed by field name
 *            e.g. { email: "Format d'email invalide" }, empty if everything is valid
 */

export function validateRegister(email: string, password: string, name: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (name === "") {
        errors.name = "Le nom est requis";
    }

    // The format is only checked if the field is filled in:
    // only one message at a time per field
    if (email === "") {
        errors.email = "L'email est requis";
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = "Format d'email invalide";
    }

    if (password === "") {
        errors.password = "Le mot de passe est requis";

    } else if (!isValidPassword(password)) {
        // Like the API: a single message that recalls all the rules
        errors.password = PASSWORD_RULES_MESSAGE;
    }

    return errors;

}


/**
 * Checks the profile update form data.
 *
 * @returns - An errors object indexed by field name,
 *          empty if everything is valid
 */
export function validateUpdateProfile(email: string, name: string): Record<string, string> {

    const errors: Record<string, string> = {};

    if (name.length < 2) {
        errors.name = "Le nom doit contenir au moins 2 caractères."
    }

    if (email === "") {
        errors.email = "L'email ne peut pas être vide."
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = "Format d'email invalide."
    }

    return errors;
}


/**
 * Checks the API password rules:
 * 8 characters minimum, an uppercase letter, a lowercase letter, a digit and a special character among @$!%*?&
 */
function isValidPassword(password: string): boolean {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&]/.test(password)
    );
}


/**
 * Checks the password change fields.
 * Both fields empty means the user does not change their password.
 *
 * @returns - An errors object indexed by field name, empty if everything is valid or unchanged.
 */
export function validatePasswordChange(currentPassword: string, newPassword: string): Record<string, string> {
    const errors: Record<string, string> = {};

    // Both empty: no password change
    if (currentPassword === "" && newPassword === "") {
        return errors;
    }

    if (currentPassword === "") {
        errors.currentPassword = "Renseignez votre mot de passe actuel";
    }

    if (newPassword === "") {
        errors.newPassword = "Renseignez le nouveau mot de passe";
    } else if (!isValidPassword(newPassword)) {
        errors.newPassword = PASSWORD_RULES_MESSAGE;
    }

    return errors;
}


// Project limits, the same as the API's
export const PROJECT_NAME_MIN_LENGTH = 2;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const PROJECT_DESCRIPTION_MAX_LENGTH = 500;

/**
 * Checks the fields shared by the creation and the edition of a project: name and description.
 *
 * NOTE: the API accepts an empty description, but the mockups mark it with an asterisk:
 * it is required here, like for the tasks. Messages for the lengths are the API's.
 *
 * @returns An errors object indexed by field name, empty if everything is valid.
 */
export function validateProjectForm(name: string, description: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (name === "") {
        errors.name = "Le nom du projet est requis";
    } else if (name.length < PROJECT_NAME_MIN_LENGTH) {
        errors.name = "Le nom du projet doit contenir au moins 2 caractères";
    } else if (name.length > PROJECT_NAME_MAX_LENGTH) {
        errors.name = "Le nom du projet ne peut pas dépasser 100 caractères";
    }

    if (description === "") {
        errors.description = "La description du projet est requise";
    } else if (description.length > PROJECT_DESCRIPTION_MAX_LENGTH) {
        errors.description = "La description ne peut pas dépasser 500 caractères";
    }

    return errors;
}

/**
 * Checks the project creation form data: the shared fields, plus at least one contributor.
 *
 * NOTE: the "at least one contributor" rule is stricter than the API's (which accepts a project
 * without contributor). It is not applied when editing a project: removing everyone is allowed.
 *
 * @returns An errors object indexed by field name, empty if everything is valid.
 */
export function validateCreateProject(name: string, description: string, contributors: string[]): Record<string, string> {
    const errors = validateProjectForm(name, description);

    if (contributors.length === 0) {
        errors.contributors = "Ajoutez au moins un contributeur";
    }

    return errors;
}


/** Longest comment the API accepts (the comment field is also limited to it with maxLength) */
export const COMMENT_MAX_LENGTH = 2000;

/**
 * Checks a comment, with the messages of the API.
 *
 * @param content - The comment, already trimmed
 * @returns An errors object indexed by field name ("content"), empty if everything is valid.
 */
export function validateComment(content: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (content === "") {
        errors.content = "Le contenu du commentaire est requis";
    } else if (content.length > COMMENT_MAX_LENGTH) {
        errors.content = "Le contenu du commentaire ne peut pas dépasser 2000 caractères";
    }

    return errors;
}


/**
 * Checks the task form data, for both the creation and the edition of a task.
 *
 * NOTE: the API only requires the title; the description and the due date are required here
 * because the creation mockup marks them with an asterisk, and the edit form follows the same
 * rules so that a task never loses them. Messages for the title, the description
 * length and the date format are the API's.
 *
 * @param status - Value of the status radio group (the form always submits one)
 * @returns An errors object indexed by field name, empty if everything is valid.
 */
export function validateTaskForm(title: string, description: string, dueDate: string, status: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (title === "") {
        errors.title = "Le titre de la tâche est requis";
    } else if (title.length < TASK_TITLE_MIN_LENGTH) {
        errors.title = "Le titre de la tâche doit contenir au moins 2 caractères";
    } else if (title.length > TASK_TITLE_MAX_LENGTH) {
        errors.title = "Le titre de la tâche ne peut pas dépasser 200 caractères";
    }

    if (description === "") {
        errors.description = "La description de la tâche est requise";
    } else if (description.length > TASK_DESCRIPTION_MAX_LENGTH) {
        errors.description = "La description ne peut pas dépasser 1000 caractères";
    }

    if (dueDate === "") {
        errors.dueDate = "L'échéance est requise";
    } else if (!isValidDateInput(dueDate)) {
        errors.dueDate = "Format de date invalide";
    }

    // Cannot happen with the form (radio buttons), but the action can be called with any data
    if (!VALID_TASK_STATUSES.includes(status)) {
        errors.status = "Statut invalide";
    }

    return errors;
}


/**
 * Checks that a text is a real calendar date written YYYY-MM-DD.
 * The regex checks the shape. Then the date is converted back to text and compared with the
 * input: `new Date("2026-02-31")` does not fail, it rolls over to 2026-03-03, so a date that
 * changes in the round trip does not exist (an invalid month gives NaN, hence the isNaN test).
 */
function isValidDateInput(value: string): boolean {
    if (!DATE_REGEX.test(value)) {
        return false;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
