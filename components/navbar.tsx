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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 248, 244, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1.5px solid rgba(0, 0, 0, 0.07);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0,0,0,0.03);
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          margin-left: 1px;
          vertical-align: super;
          box-shadow: 0 0 6px rgba(249,115,22,0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-link:hover {
          color: #111827;
          background: rgba(0,0,0,0.05);
        }
        .nav-link.active {
          color: #ea580c;
          background: rgba(249,115,22,0.08);
          font-weight: 600;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #f97316, #ef4444);
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #b91c1c;
          background: rgba(239,68,68,0.08);
          border: 1.5px solid rgba(239,68,68,0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.35);
          box-shadow: 0 2px 12px rgba(239,68,68,0.15);
        }

        .btn-login {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          background: white;
          border: 1.5px solid rgba(0,0,0,0.1);
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .btn-login:hover {
          border-color: rgba(249,115,22,0.35);
          box-shadow: 0 2px 12px rgba(249,115,22,0.12);
          color: #111827;
        }

        .btn-signup {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
          box-shadow: 0 3px 14px rgba(249,115,22,0.3), 0 1px 4px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          border: none;
        }
        .btn-signup:hover {
          box-shadow: 0 6px 22px rgba(249,115,22,0.42), 0 2px 6px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          border-radius: 999px;
          background: white;
          border: 1.5px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ef4444);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .user-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>

      <div className="navbar-root">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

          {/* ── LEFT ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-8">

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.04 }} className="flex items-center">
                <span className="logo-text">QuizzKr</span>
                <span className="logo-dot" />
              </motion.div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavItem href="/dashboard" active={pathname === "/dashboard"}>
                <LayoutDashboard size={15} />
                Dashboard
              </NavItem>
              <NavItem href="/quizzes" active={pathname === "/quizzes"}>
                <BookOpen size={15} />
                Quizzes
              </NavItem>
              <NavItem href="/history" active={pathname === "/history"}>
                <History size={15} />
                History
              </NavItem>
            </nav>
          </div>

          {/* ── RIGHT ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">
            {session ? (
              <>
                {/* User chip */}
                <div className="user-chip hidden sm:flex">
                  <div className="user-avatar">
                    {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="user-name">{session.user?.name}</span>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="btn-logout"
                >
                  <LogOut size={15} />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/login" className="btn-login">
                    <LogIn size={15} />
                    Login
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/signup" className="btn-signup">
                    <UserPlus size={15} />
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

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
    <Link href={href} className={`nav-link ${active ? "active" : ""}`}>
      <motion.span
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-1.5"
      >
        {children}
      </motion.span>
    </Link>
  )
}