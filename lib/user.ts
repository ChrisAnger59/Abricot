// Appelle apiFetch, qui lit le token : ne doit jamais être envoyé au navigateur
import "server-only";

import { apiFetch } from '@/lib/api';
import { cache } from 'react';
import type { ProfileData, User } from "@/types/api";


/**
 * Récupère l'utilisateur connecté
 * 
 * Enveloppé dans cache, si plusieurs composants l'appellent pendant l'affichage d'une même page
 * L'API n'est interrogée qu'une seule fois. Les appels suivant recoivent le resultat mémorisé
 * 
 * Le cache ne dure que le temps de d'afficher une page, pour une requête
 * Chaque nouvelle page récupère à nouveau un utilisateur à jour
 * 
 * Utilisé à la place d'un Context, les composants qui en ont besoin peuvent ainsi rester des composants serveur
 * 
 * @returns - L'utilisateur connecté, ou null si l'API ne peut pas le fournir
 */
export const getCurrentUser = cache(async (): Promise<User | null> =>{

    // Si le token est invalide (401), apiFetch redirige vers /login avant d'arriver ici
    const result = await apiFetch<ProfileData>("/auth/profile");

    if (!result.success) {
        // Erreurs visibles dans le terminal, jamais affiché à l'utilisateur
        // Renvoie null plutot que de lancer une erreur
        // Chaque composant décide de son affichage de repli, sans faire planter la page
        console.error("Profil indeisponnible:", result.message);
        return null;
    }

    return result.data.user;

});