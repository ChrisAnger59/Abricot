import FormField from "@/components/Atoms/FormField";

function Register() {
    return (
        <form className="flex flex-col gap-5">
            <h1 className="text-center">Inscription</h1>

            <FormField
                id="email"
                label="Email"
                type="email"
                name="email"
                required
            />

            <FormField
                id="password"
                label="Mot de passe"
                type="password"
                name="password"
                required
            />

            <FormField
                id="name"
                label="Nom et Prénom"
                type="text"
                name="name"
                required
            />

            <button className="rounded-btn bg-dark text-surface p-4">S'inscrire'</button>

            <p>Déjà un Compte ? <a href="#">Se connecter</a></p>
        </form>
    );
}

export default Register;