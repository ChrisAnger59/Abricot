"use client";

import { useActionState } from "react";
import FormField from "@/components/Atoms/FormField";
import { register } from "@/lib/actions/auth";
import { AuthFormState } from "@/types/api";

const initialState: AuthFormState = {};

function Register() {

    const [state, formAction, isPending] = useActionState(register, initialState);

    return (
        <form className="flex flex-col gap-5" action={formAction} noValidate>
            <h1 className="text-center">Inscription</h1>

            <FormField
                id="email"
                label="Email"
                type="email"
                name="email"
                defaultValue={state.values?.email}
                error={state.fieldErrors?.email}
                required
            />

            <FormField
                id="password"
                label="Mot de passe"
                type="password"
                name="password"
                error={state.fieldErrors?.password}
                required
            />

            <FormField
                id="name"
                label="Nom et Prénom"
                type="text"
                name="name"
                defaultValue={state.values?.name}
                error={state.fieldErrors?.name}
                required
            />

            <button className="rounded-btn bg-dark text-surface p-4" disabled={isPending}>
                {isPending ? "inscription..." : "S'Inscrire"}
            </button>

            <p>Déjà un Compte ? <a href="#">Se connecter</a></p>
        </form>
    );
}

export default Register;