import "server-only";

import { apiFetch } from '@/lib/api';
import { cache } from 'react';
import type { ProfileData, User } from "@/types/api";

export const getCurrentUser = cache(async (): Promise<User | null> =>{

    const result = await apiFetch<ProfileData>("/auth/profile");

    if (!result.success) {
        console.error("Profil indeisponnible:", result.message);
        return null;
    }

    return result.data.user;

});