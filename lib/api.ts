// Ce fichier manipule le token : il ne doit jamais être envoyé au navigateur
import "server-only";

import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";
import type { ApiResponse } from "@/types/api";

/**
 * Appelle une route protégée de l'API en joignant automatiquement le token de session
 * 
 * - Sans options: envoie une requete GET (methode par defaut de fetch)
 * - Avec options: transmet la methode et le body (PUT, POST, etc)
 * - Redirige vers "/login" si l'API refuse le token (code 401)
 * 
 * Toutes les requêtes authentifiées doivent passer par cette fonction
 * Exceptions: Login et Register, qui n'ont pas de token
 * 
 * @param path - Chemin de la route, qui commence par '/' (ex: "/auth/profile")
 * @param options - Options de fetch (method, body...), facultatives
 * @returns - La methode de l'API, typé T (la forme de la data, en cas de succès)
 * 
 * @example 
 * const result = await apiFetch<ProfileData>("auth/profile");
 * 
 * @example
 * const result = await apiFetch<ProfileData>("/auth/profile", {method: "PUT", body: JSON.stringify({ email, name })});
 */

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {

    const token = await getToken();

    // Déclarer avant le try pour rester accessible après
    let response: Response;

    try {
        response = await fetch(`${process.env.API_URL}${path}`, {
            ...options,

            // Placé après "...options" pour ne pas écraser le token
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
    } catch {

        // fetch n'échoue que si l'API ne répond pas (serveur éteint)
        // On envoie une réponse au format ApiError (/types/api.ts) pour que l'appelant n'ai qu'à tester success
        return {
            success: false,
            message: "Impossible de contacter le serveur",
            error: "NETWORK_ERROR"
        };
    }

    const result: ApiResponse<T> = await response.json();

    // token expiré ou falsifié: l'API est seule à pouvoir le vérifier
    // Seule une 401 due au token (manquant, expiré, falsifié) déconnecte l'utilisateur.
    // Une autre 401 (ex. : mot de passe actuel incorrect) est renvoyée à l'appelant.
    // Les cookies sont en lecture seule pendant l'affichage d'une page, on ne peut pas le supprimer ici
    // Le paramètre "session=expired" demande au proxy (/proxy.ts) de le faire
    // En dehors du try: redirect déclenche une erreur spécifique que le catch intercepterait.
    if (response.status === 401 && !result.success && result.error === 'Authentication failed') {
        redirect("/login?session=expired");
    }

    return result;
}
