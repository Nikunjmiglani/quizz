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
    return <div className="p-6">Checking auth...</div>
  }

  if (!data) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white p-6">
      
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Total Attempts</p>
              <Activity className="text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mt-3">
              {data.totalAttempts}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Average Score</p>
              <Target className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mt-3">
              {data.avgScore}%
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Suspicious</p>
              <AlertTriangle className="text-red-400" />
            </div>
            <h2 className="text-3xl font-bold mt-3 text-red-400">
              {data.suspiciousCount}
            </h2>
          </motion.div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-300">
              Score Distribution
            </h3>
            <IncreaseSizePieChart data={data.scoreBuckets} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-300">
              Attempts per Quiz
            </h3>
            <AttemptsBarChart data={data.attemptsPerQuiz} />
          </motion.div>

        </div>
      </div>
    </div>
  )
}