"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function History() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/history")
        const data = await res.json()
        setAttempts(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">Loading your history...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 md:px-10 lg:px-16 py-20">

      <div className="max-w-4xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8">
          My Attempts
        </h1>

        {/* EMPTY STATE */}
        {attempts.length === 0 && (
          <div className="text-center text-gray-400 border border-white/10 p-10 rounded-xl bg-white/5">
            No attempts yet.
            <br />
            Start a quiz to see your performance here.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-5">
          {attempts.map((a, i) => {
            const percentage = ((a.score / a.total) * 100).toFixed(1)

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/10 transition"
              >

                {/* LEFT */}
                <div>
                  <h2 className="text-lg font-semibold">
                    {a.quiz.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(a.startedAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">

                  {/* SCORE */}
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {a.score}/{a.total}
                    </p>
                    <p className="text-xs text-gray-400">
                      Score
                    </p>
                  </div>

                  {/* PERCENT */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-yellow-400">
                      {percentage}%
                    </p>
                    <p className="text-xs text-gray-400">
                      Accuracy
                    </p>
                  </div>

                  {/* STATUS */}
                  {a.suspicious && (
                    <div className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">
                      Suspicious
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