"use client";

import { useActionState } from "react";
import Link from "next/link";
import FormField from "@/components/Atoms/FormField";
import { login } from "@/lib/actions/auth";
import type { AuthFormState } from "@/types/api";

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    

      <form className="flex flex-col gap-5" action={formAction}>

        <h1 className="text-center text-primary text-[xx-large] font-semibold">Connexion</h1>
        
        <FormField
          id="email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          required
        />

        <FormField
          id="password"
          label="Mot de passe"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />

        {state.message && (
          <p className="text-sm text-todo-text">{state.message}</p>
        )}

        <button
          type="submit"
          className="rounded-btn bg-dark p-4 text-surface"
          disabled={isPending}
        >
          {isPending ? "Connexion…" : "Se connecter"}
        </button>

        <Link href="#" className="text-primary underline text-center">Mot de passe oublié?</Link>
        
      </form>
  );
}