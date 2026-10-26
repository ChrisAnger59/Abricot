// Types décrivants les données échangées avec l'API
// Créé à partir des réponses réelles de l'API (test Swagger et Postman)

/**
 * Utilisateur renvoyé par l'API
 * mdp jamais renvoyé.
 */
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Erreur de validation portant sur un champ précis du formulaire
 * ex: { field: "email", message: "Format d'email invalide" }
 */
export interface FieldError {
    field: string;
    message: string;
}

/**
 * Réponse réussie de l'API 
 * La structure est toujours la même, uniquement le contenu de "data" change selon la route
 * T représente la forme de data, précisé à chaque utilisation
 * 
 * @example - ApiSuccess<ProfileData> => data contient { user }
 */
export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}


/**
 * Réponse échoué de l'API
 * Les erreurs de validations arrivent de l'API dans data.errors
 */
export interface ApiError {

    success: false;

    /** Message destiné à l'utilisateur (ex. : "Email ou mot de passe incorrect") */
    message: string;

    /** Code technique stable, à tester dans le code (ex. : "EMAIL_ALREADY_EXISTS") */
    error: string;

    /** Présent uniquement pour les erreurs de validation (400) */
    data?: {
        errors: FieldError[];
    }
}


/**
 * Réponses de l'API: Reussie ou échouée
 * Tester "result.success" permet à TypeScript de savoir dans quel cas on se trouve
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;


/**
 * Contenu de data pour "POST /auth/login" et "POST auth/register"
 */
export interface AuthData {
    user: User;
    token: string;
}


/**
 * Contenu de data pour "GET /auth/profile" et "PUT /auth/profile"
 * L'utilisateur se trouve dans data.user
 */
export interface ProfileData {
    user: User;
}


/**
 * Etat d'un formulaire d'authentification, géré par useActionSate
 * 
 * Ce que renvoient les Server Actions (login, register, ...) quand l'envoi échoue
 * et ce que le formulaire affiche. Vide ({}) au premier affichage
 */
export interface AuthFormState {

    /** Erreur générale, non liée à un champ (ex. : identifiants incorrects, serveur injoignable) */
    message?: string;

    /** Erreurs par champ, indexées par nom de champ (ex. : { password: "..." }) */
    fieldErrors?: Record<string, string>;

    /** Valeurs saisies à réafficher après une erreur (jamais le mot de passe) */
    values?: Record<string, string>;

    /** Message de confirmation, après une modification réussie */
    success?: string;
}