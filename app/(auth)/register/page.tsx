import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Atoms/Logo";
import RegisterForm from "@/components/Organisms/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription",
};

function RegisterPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-10 h-full justify-around">
            <Logo size="large" />

            <RegisterForm />

            <p className="text-sm text-center">
                Déjà inscrit ?{" "}
                <Link href="/login" className="text-primary underline">
                    Se connecter
                </Link>
            </p>
        </div>    
    );
}

export default RegisterPage;