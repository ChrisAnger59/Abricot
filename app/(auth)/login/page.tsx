"use client";

import { useActionState } from "react"
import FormField from "@/components/Atoms/FormField";
import { login } from "@/lib/actions/auth"
import { AuthFormState } from "@/types/api";

const initialState: AuthFormState = {};

function Login() {

    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <form className="flex flex-col gap-5" action={formAction}>
            <h1 className="text-center">Connexion</h1>

            <FormField
                id="email"
                label="Email"
                type="email"
                name="email"
                defaultValue={state.values?.email}
                required
            />

            <FormField
                id="password"
                label="Mot de passe"
                type="password"
                name="password"
                required
            />

            {state.message && (
                <p className="text-sm text-todo-text">{state.message}</p>
            )}

            <button className="rounded-btn bg-dark text-surface p-4" disabled={isPending}>
                {isPending ? "Connexion..." : "Se connecter"}
            </button>

            <a href="#">Mot de passe oublié</a>
        </form>
    );
}

export default Login;