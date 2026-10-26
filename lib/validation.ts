/**
 * Préparation et validation des données de formulaires
 * 
 * La validation est faite dans les Server Actions (login, register, etc) avant tout appel à l'API
 * Pour éviter une requête inutile quand les données sont invalides
 * Les règles et les messages reprennent ceux de l'API
 * 
 * L'utilisateur voit le même texte, que l'erreur soit détécté ici où par l'API
 * 
 * Pas de "use server", ce sont des fonctions ordinaires
 * Dans un fichier "use server", seules des Server Actions async peuvent être exportées
 */

// Message de l'API pour toute règle de mdp non respéctée
const PASSWORD_RULES_MESSAGE = "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&)"

// Format email simplifié : text@text.text, sans espace
// Vérifie la forme globale, l'API reste juge
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/**
 * Récupère la valeur d'un champs de formulaire, toujours sous forme de texte
 * 
 * fromData.get peut renvoyer null (si champ absent) ou un fichier (input de type file)
 * La fonction garantie un string, éventuellement vide
 * 
 * @param formData - Les données envoyées par le formulaire
 * @param key - L'attribut name du champ
 * @param trim - Retire les espaces au début et à la fin (true par defaut) / A désactiver pour un mdp
 * @returns - La valeur du champ, ou "" si elle est absente ou n'est pas du texte
 */
export function getString(formData: FormData, key: string, trim = true): string {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return trim ? value.trim() : value;
}


/** 
 * Vérifie les données du formulaire d'inscription
 * 
 * @param email - Valeur du champs name="email" du formulaire
 * @param password - Valeur du champs name="password" du formulaire
 * @param name - Valeur du champs name="name" du formulaire
 * @returns - Un objet d'erreurs indexé par nom de champs
 *            ex : { email: "Format d'email invalide" }, vide si tout est valide
 */

export function validateRegister(email: string, password: string, name: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (name === "") {
        errors.name = "Le nom est requis";
    }

    // Le format n'est vérifié que si le champ est rempli:
    // Un seul message à la fois par champs
    if (email === "") {
        errors.email = "L'email est requis";
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = "Format d'email invalide";
    }

    if (password === "") {
        errors.password = "Le mot de passe est requis";

    } else if (isValidPassword(password)) {
        // Comme l'API : un seul message qui rappelle toutes les règles
        errors.password = PASSWORD_RULES_MESSAGE;
    }

    return errors;

}


/**
 * 
 * Vérifie les données du formulaire de modification du profil
 * 
 * @returns - Un objet d'erreurs indexé par nom de champs
 *          vide si tout est valide
 */
export function validateUpdateProfile(email: string, name: string): Record<string, string> {

    const errors: Record<string, string> = {};

    if (name !== "" && name.length < 2) {
        errors.name = "Le nom doit contenir au moins 2 caractères"; 
    }

    if (email !== "" && !EMAIL_REGEX.test(email)) {
        errors.email = "Format d'email invalide";
    }

    return errors;
}


/**
 * Vérifie les règles de mdp de l'API:
 * 8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&
 */
function isValidPassword(password: string): boolean {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&]/.test(password)
    );
}


/**
 * Vérifie les champs de changement de mdp
 * Les deux champs vides signifient que l'utilisateur ne change pas son mdp
 * 
 * @returns - Un objet d'erreurs indexé par nom de champs, vide si tout est valide ou inchangé.
 */
export function validatePasswordChange(currentPassword: string, newPassword: string): Record<string, string> {
    const errors: Record<string, string> = {};

    // Les deux vides : pas de changement de mot de passe
    if (currentPassword === "" && newPassword === "") {
        return errors;
    }

    if (currentPassword === "") {
        errors.currentPassword = "Renseignez votre mot de passe actuel";
    }

    if (newPassword === "") {
        errors.newPassword = "Renseignez le nouveau mot de passe";
    } else if (!isValidPassword(newPassword)) {
        errors.newPassword = PASSWORD_RULES_MESSAGE;
    }

    return errors;
}