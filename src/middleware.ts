import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default async function middleware(req: NextRequest) {
    // Basic Auth implementation for "Site Lock"
    const isLocked = process.env.ENABLE_SITE_LOCK === "true";

    if (isLocked) {
        const basicAuth = req.headers.get("authorization")

        if (basicAuth) {
            const authValue = basicAuth.split(" ")[1]
            const [user, pwd] = atob(authValue).split(":")

            // Default username is 'admin', password is set in env
            if (user === "admin" && pwd === process.env.SITE_PASSWORD) {
                // Valid credentials, proceed with NextAuth
                return auth(req as any)
            }
        }

        return new NextResponse("Auth Required.", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="Secure Area"',
            },
        })
    }

    // If lock is disabled, just run NextAuth
    return auth(req as any)
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
