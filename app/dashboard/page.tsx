"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LogOut,
  Activity,
  Target,
  AlertTriangle,
  TrendingUp,
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
    return (
      <div className="min-h-dvh flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-dvh bg-[#0B0F19] text-white">

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Overview of your quiz performance
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <KpiCard
            title="Attempts"
            value={data.totalAttempts}
            icon={<Activity size={18} />}
          />

          <KpiCard
            title="Avg Score"
            value={`${data.avgScore}%`}
            icon={<Target size={18} />}
          />

          <KpiCard
            title="Suspicious"
            value={data.suspiciousCount}
            icon={<AlertTriangle size={18} />}
            danger
          />

          <KpiCard
            title="Trend"
            value="+12%"
            icon={<TrendingUp size={18} />}
            positive
          />
        </div>

        {/* MAIN ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* BIG CHART */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-sm text-gray-400 mb-3">
              Attempts per Quiz
            </h3>

            <div className="h-[260px] sm:h-[320px]">
              <AttemptsBarChart data={data.attemptsPerQuiz} />
            </div>
          </div>

          {/* PIE */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-sm text-gray-400 mb-3">
              Score Distribution
            </h3>

            <div className="h-[260px] sm:h-[320px]">
              <IncreaseSizePieChart data={data.scoreBuckets} />
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <InsightCard
            title="Performance Insight"
            text="Your average score is improving. Focus on consistency to push above 80%."
          />

          <InsightCard
            title="Risk Alert"
            text={`${data.suspiciousCount} suspicious attempts detected. Review flagged users.`}
            danger
          />
        </div>

      </div>
    </div>
  )
}

function KpiCard({ title, value, icon, danger, positive }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
    >
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <h2
          className={`text-lg font-semibold mt-1 ${
            danger
              ? "text-red-400"
              : positive
              ? "text-green-400"
              : ""
          }`}
        >
          {value}
        </h2>
      </div>
      <div className="text-gray-300">{icon}</div>
    </motion.div>
  )
}

function InsightCard({ title, text, danger }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3
        className={`text-sm font-medium mb-2 ${
          danger ? "text-red-400" : "text-gray-300"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs text-gray-400">{text}</p>
    </div>
  )
}