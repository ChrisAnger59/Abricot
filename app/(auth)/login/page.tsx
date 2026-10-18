import FormField from "@/components/Atoms/FormField";

function Login() {
    return (
        <form className="flex flex-col gap-5">
            <h1 className="text-center">Connexion</h1>

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

            <button className="rounded-btn bg-dark text-surface p-4">Se connecter</button>

            <a href="#">Mot de passe oublié</a>
        </form>
    );
}

export default Login;