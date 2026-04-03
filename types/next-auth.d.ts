import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: "USER" | "CREATOR" | "ADMIN"
  }

  interface Session {
    user: {
      id: string
      role: "USER" | "CREATOR" | "ADMIN"
      email: string
      name?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "USER" | "CREATOR" | "ADMIN"
  }
}