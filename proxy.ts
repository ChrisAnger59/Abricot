/**
 * Special Next.js file that is being execute before every requests
 */

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function proxy(request: NextRequest) {

    const { pathname, searchParams } = request.nextUrl;

    if (pathname === "/login" && searchParams.get("session") === "expired") {
        const response = NextResponse.next();
        response.cookies.delete(SESSION_COOKIE);
        return response;
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isLoggedIn = Boolean(token);
    const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);

    if (!isPublicRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/projects",
        "/account"
    ]
};