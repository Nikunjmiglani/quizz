import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

 callbacks: {
  async jwt({ token }) {
    // 🔥 ALWAYS refresh from DB (not just on login)
    if (token?.email) {
      const user = await prisma.user.findUnique({
        where: { email: token.email },
        select: { id: true, role: true },
      })

      if (user) {
        token.id = user.id
        token.role = user.role
      }
    }

    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string
      session.user.role = token.role as "USER" | "CREATOR" | "ADMIN"
    }
    return session
  },
}
}