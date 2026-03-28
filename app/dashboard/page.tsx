"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LogOut,
  Activity,
  Target,
  AlertTriangle,
} from "lucide-react"

import { IncreaseSizePieChart } from "@/components/charts/pie-chart"
import { AttemptsBarChart } from "@/components/charts/bar-chart"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login"
    }
  }, [status])

  useEffect(() => {
    if (status !== "authenticated") return

    async function fetchData() {
      const res = await fetch("/api/dashboard", {
        credentials: "include",
      })

      const result = await res.json()
      if (result.success) setData(result.data)
    }

    fetchData()
  }, [status])

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center text-gray-400">Checking auth...</div>
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center text-gray-400">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Welcome back, {session?.user?.name}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg transition w-full sm:w-auto"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-md"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Total Attempts</p>
              <Activity className="text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3">
              {data.totalAttempts}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-md"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Average Score</p>
              <Target className="text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3">
              {data.avgScore}%
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-xl p-5 shadow-md"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Suspicious</p>
              <AlertTriangle className="text-red-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-red-400">
              {data.suspiciousCount}
            </h2>
          </motion.div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-md"
          >
            <h3 className="text-base font-semibold mb-4 text-gray-300">
              Score Distribution
            </h3>

            <div className="w-full h-[280px] sm:h-[320px]">
              <IncreaseSizePieChart data={data.scoreBuckets} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-md"
          >
            <h3 className="text-base font-semibold mb-4 text-gray-300">
              Attempts per Quiz
            </h3>

            <div className="w-full h-[280px] sm:h-[320px]">
              <AttemptsBarChart data={data.attemptsPerQuiz} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}