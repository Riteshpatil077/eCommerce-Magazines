import { NextResponse } from "next/server"
import * as jose from "jose" // Use 'jose' for middleware (it's faster & native-friendly)
import jwt from "jsonwebtoken"
export async function proxy(req: any) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  // 1. If no token, send to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    // 2. Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jose.jwtVerify(token, secret)
    const userRole = payload.role as string

    // 3. ADMIN PROTECTION:
    // If the URL starts with /dashboard/admin, but they are NOT an ADMIN
    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url)) // Send back to User home
    }

    // 4. USER PROTECTION (Optional):
    // If an Admin tries to go to a User-only area, you can let them or redirect

    return NextResponse.next()
  } catch (err) {
    // Token is fake or expired
    return NextResponse.redirect(new URL("/login", req.url))
  }
}