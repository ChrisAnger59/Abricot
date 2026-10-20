import "server-only";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";
import type { ApiResponse } from "@/types/api";

export async function apiFetch<T>(path: string): Promise<ApiResponse<T>> {
    const token = await getToken();
    const response = await fetch(`${process.env.API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });


    if (response.status === 401) {
        redirect("/login?session=expired");
    }

    return response.json();
}
