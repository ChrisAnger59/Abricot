import { cookies } from "next/headers";

const SESSION_COOKIE = "session_token";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function createSession(token: string) {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: '/',
        maxAge: SESSION_DURATION
    });
}

export async function getToken() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);

    return cookie ? cookie.value : undefined;
}

export async function deleteSessions() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}