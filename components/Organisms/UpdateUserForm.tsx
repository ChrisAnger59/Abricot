"use client";

import { useActionState } from "react";
import FormField from "@/components/Atoms/FormField";
import { updateUser } from "@/lib/actions/auth";
import type { AuthFormState, User } from "@/types/api";

interface ProfileFormProps {
    user: User;
}

const initialState: AuthFormState = {};

export default function UpdateUserForm({ user }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(updateUser, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <div>
                <h1 className="font-bold">Mon compte</h1>
                <h2 className="text-text-muted">{user.name}</h2>
            </div>
            <FormField
                id="name"
                label="Nom"
                type="text"
                name="name"
                autoComplete="name"
                placeholder={user.name}
                defaultValue={state.values?.name}
                error={state.fieldErrors?.name}
            />

            <FormField
                id="email"
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={user.email}
                defaultValue={state.values?.email}
                error={state.fieldErrors?.email}
            />

            <FormField
                id="currentPassword"
                label="Mot de passe actuel"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                error={state.fieldErrors?.currentPassword}
            />

            <FormField
                id="newPassword"
                label="Nouveau mot de passe"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                error={state.fieldErrors?.newPassword}
            />

            {state.message && (
                <p className="text-sm text-todo-text">{state.message}</p>
            )}

            {state.success && (
                <p role="status" className="text-sm text-done-text">{state.success}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="self-start rounded-btn bg-dark px-6 py-3 text-sm text-white disabled:opacity-50"
            >
                {isPending ? "Enregistrement..." : "Modifier les informations"}
            </button>
        </form>
    );
}