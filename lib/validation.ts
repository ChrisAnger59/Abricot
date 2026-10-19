const PASSWORD_RULES_MESSAGE = "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"

export function getString(formData: FormData, key: string, trim = true): string {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return trim ? value.trim() : value;
}

export function validateRegister(email: string, password: string, name: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (name === "") {
        errors.name = "Le nom est requis";
    }

    if (email === "") {
        errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Format d'email invalide";
    }

    if (password === "") {
        errors.password = "Le mot de passe est requis";
    } else if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[@$!%*?&]/.test(password)
    ) {
        errors.password = PASSWORD_RULES_MESSAGE;
    }

    return errors;

}