/**
 * Calcule les initiales à afficher dans un avatar
 * 
 * Première lettre du premier mot + premiere lettre du dernier
 * Pour obtenir 2 lettres quelque soit le nombre de mots (plusieurs noms, nom composé, etc)
 * 
 * @param username - Le nom complet de l'utilisateur
 * @returns - Les initiales en majuscules, ou "?" si le nom est vide
 * 
 * @example - getInitials("Alice Dupont") => AD
 * @example - getInitials("jean pierre dupont") => JD
 * @example - getInitials("Alice") => A
 * @example - getInitials("") => ?
 */
export function getInitials(username: string): string {
    const cleanName = username.trim();

    // À tester avant le découpage : sur un texte vide, words[0][0] vaudrait undefined
    if (cleanName === "") {
        return '?';
    }

    // /\s+/ découpe sur un ou plusieurs espaces : évite les mots vides
    // si le nom contient des espaces multiples ("Alice   Dupont")
    const words = cleanName.split(/\s+/);
    const firstInitial = words[0][0];

    // Un seul mot : le premier et le dernier mot sont le même, sinon "Alice" donnerait "AA"
    if (words.length === 1) {
        return firstInitial.toUpperCase();
    }

    const lastInitial = words[words.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
}