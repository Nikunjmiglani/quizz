"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  History,
  LogOut,
} from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <Link href="/dashboard" className="font-bold text-xl tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Quizify
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="flex items-center gap-6 text-sm text-gray-300">

            <NavItem href="/dashboard" icon={<LayoutDashboard size={16} />}>
              Dashboard
            </NavItem>

            <NavItem href="/quizzes" icon={<BookOpen size={16} />}>
              Quizzes
            </NavItem>

            <NavItem href="/history" icon={<History size={16} />}>
              History
            </NavItem>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* USER */}
          <div className="text-sm text-gray-300 hidden sm:block">
            {session.user?.name}
          </div>

          {/* LOGOUT */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-white transition"
          >
            <LogOut size={16} />
            Logout
          </motion.button>

        </div>
      </div>
    </div>
  )
}

/* 🔥 Reusable Nav Item */
function NavItem({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
      >
        {icon}
        <span>{children}</span>
      </motion.div>
    </Link>
  )
}