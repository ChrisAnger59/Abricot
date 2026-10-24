import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Atoms/Logo";
import LoginForm from "@/components/Organisms/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-10 h-full justify-around">
      <Logo size="large" />

      <LoginForm />

      <p className="text-sm">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}