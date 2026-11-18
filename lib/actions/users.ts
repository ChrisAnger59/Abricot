"use server";

import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "@/lib/user";
import type { User, UserData } from "@/types/api";

// Minimal number of characters before any search
const MIN_SEARCH_LENGTH = 3;

/**
 * Users search by email or name
 * 
 * Called on client component, as async function (no form):
 * Get the cleanQuery and return finded list
 * 
 * - No API call under 3 characters
 * - Connected user is excluded from the results (project owner)
 * It needs second API call (profile), because the cache does not imply on Server Action
 * 
 * @param query - searched cleanQuery
 * @returns Found Users or empty array
 */
export async function searchUsers(query: string): Promise<User[]> {
    const cleanQuery = query.trim();

    // Rule also checked by back end 
    if (cleanQuery.length < MIN_SEARCH_LENGTH) {
        return [];
    }

    // URLSearchparams converts cleanQuery (spaces, special character, etc)
    const params = new URLSearchParams({ query: cleanQuery });
    const result = await apiFetch<UserData>(`/users/search?${params.toString()}`);

    // As a research, an error does not block: no result
    if (!result.success) {
        return [];
    }

    const currentUser = await getCurrentUser();

    return result.data.users.filter((user) => user.id !== currentUser?.id);
}