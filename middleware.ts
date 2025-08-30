import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// https://nextjs.org/docs/14/app/building-your-application/routing/middleware
// https://next-auth.js.org/configuration/nextjs#middleware
// https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request }) 
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/")
    )) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next()
}

// in which path i have to run the middleware
export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};
