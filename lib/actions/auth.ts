"use server";
// Chaque fonction exportée devient appelable depuis le navigateur (via attribut "action=" d'un formulaire)
// Mais s'execute uniquement sur le serveur

/**
 * Server Actions d'authentification (connexion, inscription, deconnexion)
 * 
 * login et register appellent l'API avec fetch et pas apiFetch
 * l'utilisateur n'a pas encore de token
 * une erreur 401 => "identifiants incorrects" et pas "session expirée"
 * 
 * Les erreurs attendues (identifiants incorrects, email déjà utilisé, etc...)
 * Sont renvoyées au formulaire, pas lancé avec throw
 * useActionState en fait l'état du formulaire, qui les affiche sans quitter la page
 * 
 */


import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import type { ApiResponse, AuthData, AuthFormState, ApiError, ProfileData } from "@/types/api";
import { getString, validatePasswordChange, validateRegister, validateUpdateProfile } from "@/lib/validation";
import { apiFetch } from "@/lib/api";
import { refresh } from "next/cache";

// Message affiché quand l'API ne répond pas, identique dans tous les formulaires
const SERVER_ERROR_MESSAGE = "Impossible de contacter le serveur. Réessayez plus tard.";

/**
 * Transforme les erreurs de validation renvoyées par l'API en objet indexé par nom de champs
 * 
 * L'API renvoie un tableau : [{ field: "email", message: "..." }, ...]
 * Le formulaire à besoin d'un objet : { email: "..." }
 * 
 * @param error - La réponse en erreur de l'API
 * @returns - les erreurs par champs, ou un objet vide si l'erreur n'en contient pas
 */
function getFieldErrors(error: ApiError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error.data) {
    for (const item of error.data.errors) {
      fieldErrors[item.field] = item.message;
    }
  }

  return fieldErrors;
}


/**
 * Connecte l'utilisateur
 * 
 * Appelée par useActionState dans loginForm, qui fournit l'état précédent "{}", puis les données du formulaire.
 * 
 * Succès = enregistre le token dans le cookie de session, puis redirige
 * Echec = renvoie le message d'erreur et l'email saisi (mdp volontairement vidé)
 * 
 * Pas de validation de champs, le navigateur vérifie le format (required, type="password")
 * et l'API renvoie volontairement un message unique pour un email inconnu ou un mdp érroné afin de ne pas révéler quels comptes existent
 * 
 * @param _prevState - Etat précédent du formulaire, imposé par useActionState (non utilisé)
 * @param formData - Données envoyées par le formulaire
 */
export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  // Déclaré avant le try pour rester accessible après le bloc
  let result: ApiResponse<AuthData>;

  try {

    const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
    });
    console.log("Appel de l'API");

    result = await response.json();

  } catch {

    // fetch n'échoue que si l'API ne répond pas
    // Une réponse 401 n'est pas une erreur pour fetch, elle est traitée plus bas
    return {
      message: SERVER_ERROR_MESSAGE,
      values: { email }
    };

  }

  // Grâce au test de success, TypeScript sait ensuite que result est un succès
  if (!result.success) {
    return { 
        message: result.message,
        values: { email: String(email)}
    };

  }

  await createSession(result.data.token);

  // Redirect déclenche une erreur spéciale que le catch intercepterait
  redirect("/account");
}


/**
 * Inscrit un nouvel utilisateur et le connecte (l'API renvoie un token dès inscription valide)
 * 
 * Les données sont validées avant l'appel à l'API pour éviteer une requête inutile
 * Les erreurs de champs (détéctées ici ou par l'API) sont affichées sous les champs concernés
 * 
 * @param _prevState - Etat précédent du formulaire, imposé par useActionState (non utilisé ici)
 * @param formData - Données envoyées par le formulaire
 */
export async function register(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {

  const email = getString(formData, "email");
  const password = getString(formData, "password", false);
  const name = getString(formData, "name");

  // Validation locale : si un champ est invalide, l'API n'est pas appelée
  const fieldErrors = validateRegister(email, password, name);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values: { email, name }
    };
  }

  let result: ApiResponse<AuthData>;

  try {

    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name})
    });

    console.log("Appel de l'API");

    result = await response.json();

  } catch {

    return {
      message: SERVER_ERROR_MESSAGE,
      values: { email, name } 
    };

  }

  if (!result.success) {
    return {
      message: result.message,
      fieldErrors: getFieldErrors(result),
      values: { email, name }
    };
  }

  await createSession(result.data.token);
  redirect("/account");
}

/**
 * Met à jour le profil (nom, e-mail) et/ou le mot de passe de l'utilisateur connecté.
 *
 * Un champ laissé vide signifie « pas de changement » : seuls les champs remplis
 * sont validés et envoyés à l'API (qui accepte name et email comme facultatifs).
 *
 * Passe par apiFetch, car les deux routes sont protégées :
 * - le token est joint automatiquement (l'API identifie l'utilisateur grâce à lui) ;
 * - une panne réseau renvoie une réponse d'erreur (pas besoin de try / catch ici) ;
 * - un token invalide redirige vers /login.
 *
 * Toutes les données sont validées avant le moindre appel à l'API.
 * Les routes sont ensuite appelées dans cet ordre, seulement si nécessaire :
 * PUT /auth/password, puis PUT /auth/profile.
 *
 * NOTE : ces deux routes ne sont pas documentées dans le Swagger.
 *
 * @param _prevState - État précédent du formulaire, imposé par useActionState (non utilisé)
 * @param formData - Données envoyées par le formulaire
 * @returns Les erreurs ou la confirmation à afficher, et les valeurs à réafficher (jamais les mots de passe)
 */
export async function updateUser(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const name = getString(formData, "name");
  const currentPassword = getString(formData, "currentPassword", false);
  const newPassword = getString(formData, "newPassword", false);

  // Validation locale du profil et du mot de passe, réunies en un seul objet
  const fieldErrors = {
    ...validateUpdateProfile(email, name),
    ...validatePasswordChange(currentPassword, newPassword),
  };

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { email, name } };
  }

  // Seuls les champs remplis sont envoyés : un champ vide signifie « pas de changement »
  const profileChanges: { name?: string; email?: string } = {};

  if (name !== "") {
    profileChanges.name = name;
  }

  if (email !== "") {
    profileChanges.email = email;
  }

  const wantsProfileChange = Object.keys(profileChanges).length > 0;

  // Après la validation, un mot de passe actuel renseigné signifie
  // que les deux champs le sont : l'utilisateur veut changer son mot de passe
  const wantsPasswordChange = currentPassword !== "";

  if (!wantsProfileChange && !wantsPasswordChange) {
    return { message: "Aucune modification à enregistrer." };
  }

  // 1. Le mot de passe en premier : l'erreur la plus fréquente (ancien mot de passe
  //    incorrect) arrête tout avant qu'aucune modification ne soit enregistrée
  if (wantsPasswordChange) {
    const passwordResult = await apiFetch<undefined>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!passwordResult.success) {
      const errors = getFieldErrors(passwordResult);

      // L'API ne renvoie pas d'erreur par champ pour un ancien mot de passe incorrect :
      // on place son message sous le champ concerné grâce à son code
      if (passwordResult.error === "INVALID_CURRENT_PASSWORD") {
        errors.currentPassword = passwordResult.message;
      }

      return { fieldErrors: errors, values: { email, name } };
    }
  }

  // 2. Le profil, seulement si au moins un champ a été rempli
  if (wantsProfileChange) {
    const profileResult = await apiFetch<ProfileData>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileChanges),
    });

    if (!profileResult.success) {
      return {
        // Si le mot de passe vient d'être modifié, l'utilisateur doit le savoir
        message: wantsPasswordChange
          ? `Votre mot de passe a été modifié, mais pas vos informations : ${profileResult.message}`
          : profileResult.message,
        fieldErrors: getFieldErrors(profileResult),
        values: { email, name },
      };
    }
  }

  // Récupère à nouveau les données de la page : les placeholders du formulaire
  // et l'avatar du header affichent ainsi les nouvelles valeurs
  refresh();

  return { success: "Vos modifications ont été enregistrées." };
}


/**
 * Déconnecte l'utilisateur: supprime le cookie de session, puis redirige vers "/login"
 * 
 * Déclenché par un formulaire sans champs (LogOutButton)
 * L'envoie d'un formulaire étant natif en HTML, le bouton peut rester un composant serveur
 */
export async function logout() {
  await deleteSession();
  redirect("/login");
}