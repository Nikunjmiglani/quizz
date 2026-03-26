"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b">
      <div className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/quizzes">Quizzes</Link>
        <Link href="/history">History</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{session.user?.name}</span>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}