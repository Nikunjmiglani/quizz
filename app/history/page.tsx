"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Clock, Target, Zap, AlertTriangle, BookOpen } from "lucide-react"

export default function History() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/history", { credentials: "include" })
        if (res.status === 401) { router.push("/login"); return }
        const data = await res.json()
        if (!data.success) { setError("Failed to load attempts"); return }
        setAttempts(data.data || [])
      } catch (err) {
        console.error(err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (loading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "#f97316", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-semibold text-gray-400 animate-pulse">Loading your history…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)" }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
          style={{ background: "#fff1f1", border: "1px solid #fecaca", color: "#e8372a" }}
        >
          <AlertTriangle size={16} /> {error}
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-dvh px-4 sm:px-6 py-8 sm:py-12"
      style={{ background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #fed7aa",
              backdropFilter: "blur(8px)",
            }}
          >
            <Zap size={12} className="text-orange-500" fill="currentColor" />
            <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">Your History</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ color: "#1a1a2e", fontFamily: "'Sora', 'Nunito', sans-serif" }}
          >
            Attempt{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #e8372a, #d6396e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              History.
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track your quiz performance over time.
          </p>
        </div>

        {/* EMPTY STATE */}
        {attempts.length === 0 && (
          <div
            className="flex flex-col items-center gap-3 py-16 rounded-3xl text-center"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #fff3e0, #ffe0cc)", border: "1px solid #fed7aa" }}
            >
              <BookOpen size={26} style={{ color: "#f97316" }} />
            </div>
            <p className="font-bold text-gray-700" style={{ fontFamily: "'Sora', sans-serif" }}>
              No attempts yet
            </p>
            <p className="text-sm text-gray-400">Start a quiz and your results will appear here.</p>
            <a
              href="/"
              className="mt-2 inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full text-white transition hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(90deg, #f97316, #e8372a)",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              }}
            >
              Explore Quizzes →
            </a>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3 sm:space-y-4">
          {attempts.map((a, i) => {
            const percentage = Math.round((a.score / a.total) * 100)

            const accentColor =
              percentage >= 80 ? "#16a34a"
              : percentage >= 60 ? "#f97316"
              : percentage >= 40 ? "#eab308"
              : "#e8372a"

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: "easeOut" }}
                className="group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Left color accent bar */}
                <div className="flex">
                  <div
                    className="w-1 shrink-0 rounded-l-2xl"
                    style={{ background: accentColor }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 flex-1 min-w-0">

                    {/* LEFT — quiz info */}
                    <div className="min-w-0">
                      <h2
                        className="text-base sm:text-lg font-extrabold truncate"
                        style={{ color: "#1a1a2e", fontFamily: "'Sora', 'Nunito', sans-serif" }}
                      >
                        {a.quiz?.title || "Untitled Quiz"}
                      </h2>
                      <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Clock size={11} />
                        {new Date(a.startedAt).toLocaleString()}
                      </p>
                    </div>

                    {/* RIGHT — stats */}
                    <div className="flex items-center gap-3 sm:gap-5 flex-wrap">

                      {/* Score */}
                      <StatPill
                        icon={<Target size={13} />}
                        label="Score"
                        value={`${a.score}/${a.total}`}
                        color="#f97316"
                      />

                      {/* Accuracy */}
                      <StatPill
                        icon={<Zap size={13} />}
                        label="Accuracy"
                        value={`${percentage}%`}
                        color={accentColor}
                        bold
                      />

                      {/* Flagged */}
                      {a.suspicious && (
                        <div
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "#fff1f1", border: "1px solid #fecaca", color: "#e8372a" }}
                        >
                          <AlertTriangle size={11} />
                          Flagged
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer count */}
        {attempts.length > 0 && (
          <p className="text-center text-xs text-gray-400 pt-2">
            Showing{" "}
            <span className="font-bold text-gray-600">{attempts.length}</span>{" "}
            attempt{attempts.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  )
}

function StatPill({
  icon, label, value, color, bold,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bold?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
      <div
        className="flex items-center gap-1 text-sm font-extrabold"
        style={{ color: bold ? color : "#374151", fontFamily: "'Sora', sans-serif" }}
      >
        <span style={{ color }}>{icon}</span>
        {value}
      </div>
      <p className="text-[10px] text-gray-400 font-medium">{label}</p>
    </div>
  )
}