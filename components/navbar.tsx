"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  History,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <Link href="/" className="font-bold text-xl tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Quizify
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">

            <NavItem href="/dashboard" active={pathname === "/dashboard"}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavItem>

            <NavItem href="/quizzes" active={pathname === "/quizzes"}>
              <BookOpen size={16} />
              Quizzes
            </NavItem>

            <NavItem href="/history" active={pathname === "/history"}>
              <History size={16} />
              History
            </NavItem>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {session ? (
            <>
              {/* USER NAME */}
              <div className="text-sm text-gray-300 hidden sm:block">
                {session.user?.name}
              </div>

              {/* LOGOUT */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-white transition shadow"
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              {/* LOGIN */}
              <Link href="/login">
                <button className="flex items-center gap-2 px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition">
                  <LogIn size={16} />
                  Login
                </button>
              </Link>

              {/* SIGNUP */}
              <Link href="/signup">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:opacity-90 transition shadow">
                  <UserPlus size={16} />
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* 🔥 Better NavItem */
function NavItem({
  href,
  children,
  active,
}: {
  href: string
  children: React.ReactNode
  active: boolean
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition cursor-pointer
        ${active ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}
        `}
      >
        {children}
      </motion.div>
    </Link>
  )
}