"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import type { ApiResponse, AuthData, AuthFormState } from "@/types/api";

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  let result: ApiResponse<AuthData>;

  try {

    const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

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