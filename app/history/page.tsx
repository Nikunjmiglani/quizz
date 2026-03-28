"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function History() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/history", {
          credentials: "include",
        })

        if (res.status === 401) {
          router.push("/login")
          return
        }

        const data = await res.json()

        if (!data.success) {
          setError("Failed to load attempts")
          return
        }

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
      <div className="min-h-dvh flex items-center justify-center text-gray-400">
        Loading your history...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#0B0F19] text-white px-4 sm:px-6 py-8">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Attempt History
          </h1>
          <p className="text-sm text-gray-400">
            Track your quiz performance over time
          </p>
        </div>

        {/* EMPTY */}
        {attempts.length === 0 && (
          <div className="text-center text-gray-400 border border-white/10 p-8 rounded-xl bg-white/5">
            No attempts yet. Start a quiz.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {attempts.map((a, i) => {
            const percentage = ((a.score / a.total) * 100).toFixed(1)

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/10 transition"
              >
                {/* LEFT */}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-medium truncate">
                    {a.quiz?.title || "Untitled Quiz"}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.startedAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">

                  {/* SCORE */}
                  <Stat label="Score" value={`${a.score}/${a.total}`} />

                  {/* ACCURACY */}
                  <Stat
                    label="Accuracy"
                    value={`${percentage}%`}
                    highlight
                  />

                  {/* STATUS */}
                  {a.suspicious && (
                    <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                      Flagged
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: any) {
  return (
    <div className="text-center">
      <p
        className={`text-sm sm:text-base font-semibold ${
          highlight ? "text-yellow-400" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-400">
        {label}
      </p>
    </div>
  )
}