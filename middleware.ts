import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token
    const isLoginPage = req.nextUrl.pathname === "/login"

    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard",
    "/quiz/:path*",
    "/quizzes/:path*",
    "/api/attempt/:path*",
  ],
}