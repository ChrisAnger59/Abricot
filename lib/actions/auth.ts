"use server";
// Every exported function becomes callable from the browser (through the "action=" attribute of a form)
// But it only runs on the server

/**
 * Authentication Server Actions (login, register, logout)
 *
 * login and register call the API with fetch and not apiFetch:
 * the user does not have a token yet,
 * and a 401 error means "wrong credentials", not "session expired".
 *
 * Expected errors (wrong credentials, e-mail already used, etc.)
 * are returned to the form, not thrown:
 * useActionState makes them the form state, which displays them without leaving the page.
 */


import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import type { ApiResponse, AuthData, FormState, ProfileData } from "@/types/api";
import { getString, validatePasswordChange, validateRegister, validateUpdateProfile } from "@/lib/validation";
import { apiFetch, getFieldErrors } from "@/lib/api";
import { refresh } from "next/cache";
import { getCurrentUser } from "../user";

// Message displayed when the API does not answer, the same in every form
const SERVER_ERROR_MESSAGE = "Impossible de contacter le serveur. Réessayez plus tard.";

/**
 * Logs the user in.
 *
 * Called by useActionState in loginForm, which provides the previous state "{}", then the form data.
 *
 * Success = stores the token in the session cookie, then redirects
 * Failure = returns the error message and the entered e-mail (password deliberately emptied)
 *
 * No field validation: the browser checks the format (required, type="password")
 * and the API deliberately returns a single message for an unknown e-mail or a wrong password,
 * so as not to reveal which accounts exist.
 *
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 */
export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  // Declared before the try to stay accessible after the block
  let result: ApiResponse<AuthData>;

  try {

    const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
    });
    console.log("Appel de l'API");

    result = await response.json();

  } catch {

    // fetch only fails if the API does not answer
    // A 401 response is not an error for fetch, it is handled below
    return {
      message: SERVER_ERROR_MESSAGE,
      values: { email }
    };

  }

  // Thanks to the success test, TypeScript then knows result is a success
  if (!result.success) {
    return {
        message: result.message,
        values: { email: String(email)}
    };

  }

  await createSession(result.data.token);

  // Redirect throws a special error that the catch would intercept
  redirect("/account");
}


/**
 * Registers a new user and logs them in (the API returns a token as soon as the registration is valid).
 *
 * The data is validated before calling the API to avoid a useless request.
 * Field errors (detected here or by the API) are displayed under the fields concerned.
 *
 * @param _prevState - Previous state of the form, required by useActionState (unused here)
 * @param formData - Data sent by the form
 */
export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {

  const email = getString(formData, "email");
  const password = getString(formData, "password", false);
  const name = getString(formData, "name");

  // Local validation: if a field is invalid, the API is not called
  const fieldErrors = validateRegister(email, password, name);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values: { email, name }
    };
  }

  let result: ApiResponse<AuthData>;

  try {

    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name})
    });

    console.log("Appel de l'API");

    result = await response.json();

  } catch {

    return {
      message: SERVER_ERROR_MESSAGE,
      values: { email, name }
    };

  }

  if (!result.success) {
    return {
      message: result.message,
      fieldErrors: getFieldErrors(result),
      values: { email, name }
    };
  }

  await createSession(result.data.token);
  redirect("/account");
}

/**
 * Updates the profile (name, e-mail) and/or the password of the logged-in user.
 *
 * An empty field means "no change": only the filled fields are validated and sent
 * to the API (which accepts name and email as optional).
 *
 * Goes through apiFetch, because both routes are protected:
 * - the token is attached automatically (the API identifies the user thanks to it);
 * - a network failure returns an error response (no need for try / catch here);
 * - an invalid token redirects to /login.
 *
 * All the data is validated before any call to the API.
 * The routes are then called in this order, only if needed:
 * PUT /auth/password, then PUT /auth/profile.
 *
 * NOTE: these two routes are not documented in the Swagger.
 *
 * @param _prevState - Previous state of the form, required by useActionState (unused)
 * @param formData - Data sent by the form
 * @returns The errors or the confirmation to display, and the values to display again (never the passwords)
 */
export async function updateUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = getString(formData, "email");
  const name = getString(formData, "name");
  const currentPassword = getString(formData, "currentPassword", false);
  const newPassword = getString(formData, "newPassword", false);

  // Local validation of the profile and the password, merged into a single object
  const fieldErrors = {
    ...validateUpdateProfile(email, name),
    ...validatePasswordChange(currentPassword, newPassword),
  };

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { email, name } };
  }

  // FormFields always have user values
  // Compare with the current values to make an API call only when necessary
  const currentUser = await getCurrentUser();
  const wantsProfileChange = name !== currentUser?.name || email !== currentUser?.email;

  // After validation, a filled current password means
  // that both fields are filled: the user wants to change their password
  const wantsPasswordChange = currentPassword !== "";

  if (!wantsProfileChange && !wantsPasswordChange) {
    return { message: "Aucune modification à enregistrer." };
  }

  // 1. The password first: the most frequent error (wrong old password)
  //    stops everything before any change is saved
  if (wantsPasswordChange) {
    const passwordResult = await apiFetch<undefined>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!passwordResult.success) {
      const errors = getFieldErrors(passwordResult);

      // The API does not return a field error for a wrong old password:
      // its message is placed under the field concerned thanks to its code
      if (passwordResult.error === "INVALID_CURRENT_PASSWORD") {
        errors.currentPassword = passwordResult.message;
      }

      return { fieldErrors: errors, values: { email, name } };
    }
  }

  // 2. Profile, only if the name or email changed
  if (wantsProfileChange) {
    const profileResult = await apiFetch<ProfileData>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });

    if (!profileResult.success) {
      return {
        // If the password has just been changed, the user must know
        message: wantsPasswordChange
          ? `Votre mot de passe a été modifié, mais pas vos informations : ${profileResult.message}`
          : profileResult.message,
        fieldErrors: getFieldErrors(profileResult),
        values: { email, name },
      };
    }
  }

  // Fetches the page data again: the form values
  // and the header avatar then display the new values
  refresh();

  return { success: "Vos modifications ont été enregistrées." };
}


/**
 * Logs the user out: deletes the session cookie, then redirects to "/login".
 *
 * Triggered by a form without fields (LogOutButton).
 * Since submitting a form is native HTML, the button can stay a server component.
 */
export async function logout() {
  await deleteSession();
  redirect("/login");
}
