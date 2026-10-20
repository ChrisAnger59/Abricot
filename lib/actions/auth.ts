"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import type { ApiResponse, AuthData, AuthFormState } from "@/types/api";
import { getString, validateRegister } from "@/lib/validation";

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

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

    return {
      message: "Impossible de contacter le serveur.",
      values: {email:String(email)}
    };

  }


  if (!result.success) {
    return { 
        message: result.message,
        values: { email: String(email)}
    };

  }

  await createSession(result.data.token);
  redirect("/account");
}


export async function register(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {

  const email = getString(formData, "email");
  const password = getString(formData, "password", false);
  const name = getString(formData, "name");;

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
      message: "Impossible de contacter le serveur",
      values: {email: email, name: name} 
    };

  }

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    if (result.data) {
      for (const error of result.data.errors) {
        fieldErrors[error.field] = error.message;
      }
    }

    return {
      message: result.message,
      fieldErrors,
      values: { email: email, name: name }
    };
  }

  await createSession(result.data.token);
  redirect("/account");
}


export async function logout() {
  await deleteSession();
  redirect("/login");
}