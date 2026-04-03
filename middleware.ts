import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    const isLoggedIn = !!token

    if (pathname === "/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/quiz/create")) {
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token.role !== "CREATOR" && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
}
if (pathname.startsWith("/creator")) {
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token.role !== "CREATOR" && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
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
  "/dashboard/:path*",
  "/quiz/create/:path*",
  "/creator/:path*",
  "/api/attempt/:path*",
]
}