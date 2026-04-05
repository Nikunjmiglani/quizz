"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  LayoutDashboard,
  BookOpen,
  History,
  LogOut,
  LogIn,
  UserPlus,
  Trophy,
  Menu,
  X,
} from "lucide-react"

const NAV_LINKS = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/quizzes",     label: "Quizzes",     icon: BookOpen },
  { href: "/history",     label: "History",     icon: History },
 
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = session?.user?.name?.charAt(0).toUpperCase() ?? "U"

  return (
    <div className="sticky top-0 z-50 border-b border-black/[0.07] shadow-sm"
      style={{ background: "rgba(250,248,244,0.90)", backdropFilter: "blur(18px)" }}
    >
      {/* ── MAIN BAR ── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">

        {/* LEFT: logo + desktop nav */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 no-underline">
            <span
              className="font-extrabold text-xl tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              QuizzKr
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mb-3 ml-0.5 shadow-[0_0_6px_rgba(249,115,22,0.6)] animate-pulse" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? "text-orange-600 bg-orange-500/[0.08] font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.05]"
                    }`}
                >
                  <Icon size={15} />
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* RIGHT: auth + hamburger */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* User chip — hidden on xs */}
              <div className="hidden sm:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-black/[0.07] shadow-sm">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}
                >
                  {initials}
                </div>
                <span className="text-[0.8rem] font-semibold text-gray-700 max-w-[100px] truncate">
                  {session.user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-700 bg-red-500/[0.08] border border-red-500/20 hover:bg-red-500/[0.14] hover:border-red-500/35 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-black/10 shadow-sm hover:border-orange-400/35 transition-all duration-200"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white border-none transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  boxShadow: "0 3px 14px rgba(249,115,22,0.3)",
                }}
              >
                <UserPlus size={15} />
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger — always visible on mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-black/[0.08] shadow-sm text-gray-600 hover:text-orange-500 hover:border-orange-400/30 transition-all duration-200 cursor-pointer"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden md:hidden border-t border-black/[0.06]"
            style={{ background: "rgba(252,250,246,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-3 space-y-1">

              {/* Nav links */}
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.95rem] font-medium transition-all duration-200
                      ${active
                        ? "bg-orange-500/10 text-orange-600 font-bold"
                        : "text-gray-600 hover:bg-orange-500/[0.06] hover:text-orange-600"
                      }`}
                  >
                    <Icon size={17} />
                    {label}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="my-2 border-t border-black/[0.06]" />

              {/* Auth section */}
              {session ? (
                <div className="space-y-2">
                  {/* User row */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-black/[0.07]">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/login" }) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-700 bg-red-500/[0.08] border border-red-500/20 hover:bg-red-500/[0.14] transition-all duration-200 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 bg-white border border-black/10 shadow-sm hover:border-orange-400/35 transition-all duration-200"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #ef4444)",
                      boxShadow: "0 3px 14px rgba(249,115,22,0.3)",
                    }}
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}