// Ce fichier manipule le token : il ne doit jamais être envoyé au navigateur
import { cookies } from "next/headers";

/**
 * Gestion du cookie en session
 * Le token JWT renvoyé par l'API est stocké dans un cookie httpOnly(illisible par le js du navigateur)
 * Envoyé automatiquement au server Next à chaque requête (utilisable par le proxy et les composants serveur)
 * 
 * Seul fichier à connaitre le fonctionnement du cookie
 * Le reste de l'application passe uniquement par ces 3 fonctions
 */

/** Nom du cookie. Exporté pour être lu par le proxy (proxy.ts). Libre : l'API ne le voit jamais. */
export const SESSION_COOKIE = "session_token";

/** Durée de vie du cookie : 7 jours, comme le token (champ exp du JWT). */
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days


/**
 * Enregistre le token dans le cookie de session
 * 
 * A appeler uniquement depuis une Server Action (ou proxy.ts)
 * Next interdit de modifier les cookies pendant l'affichage d'une page
 * 
 * @param token - Le JWT renvoyé par l'API à la connexion ou à l'inscription
 */
export async function createSession(token: string) {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {

        // Illisible par le JavaScript de la page : protège contre le vol du token (XSS)
        httpOnly: true,

        // Envoyé uniquement en HTTPS, sauf en développement local (HTTP)
        secure: process.env.NODE_ENV === "production",

        // Jamais envoyé depuis un autre site, même via un lien : protège contre le CSRF.
        // Conséquence : un utilisateur qui arrive par un lien externe doit se reconnecter.
        sameSite: "strict",

        // Valable sur tout le site
        path: '/',

        // Le cookie expire en même temps que le token (7 jours)
        maxAge: SESSION_DURATION
    });
}


/**
 * Lit le token dans le cookie de session
 * Peut être appelé partout côté serveur (pages, Server Actions, apiFetch)
 * 
 * @returns - Le token ou undefined si l'utilisateur n'est pas connecté
 */
export async function getToken() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);

    return cookie ? cookie.value : undefined;
}


/**
 * Supprime le cookie de session (déconnexion)
 * 
 * Le token reste techniquement valide jusqu'à son expiration 
 * L'API ne garde aucune trace des connexions
 * Supprimer le cookie empêche seulement le site de l'utiliser
 */
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}