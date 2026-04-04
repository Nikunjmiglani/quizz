"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, Zap } from "lucide-react"

type Entry = {
  id: string
  rank: number
  score: number
  total: number
  percentage: number
  user: { id: string; name: string; email: string }
}

const RANK_CONFIG: Record<number, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  1: {
    icon: <Crown size={16} fill="currentColor" />,
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "#fcd34d",
  },
  2: {
    icon: <Medal size={16} fill="currentColor" />,
    color: "#94a3b8",
    bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    border: "#cbd5e1",
  },
  3: {
    icon: <Medal size={16} fill="currentColor" />,
    color: "#b45309",
    bg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    border: "#fdba74",
  },
}

function getRankDisplay(rank: number) {
  return RANK_CONFIG[rank] ?? {
    icon: <span className="text-xs font-bold">#{rank}</span>,
    color: "#9ca3af",
    bg: "transparent",
    border: "transparent",
  }
}

export default function Leaderboard({ quizId }: { quizId: string }) {
  const { data: session } = useSession()
  const [data, setData] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/quiz/${quizId}/leaderboard`)
      const json = await res.json()
      if (json.success) setData(json.leaderboard)
      setLoading(false)
    }
    fetchData()
  }, [quizId])

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-3 text-gray-400">
        <div
          className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: "#f97316", borderTopColor: "transparent" }}
        />
        <span className="text-sm font-medium animate-pulse">Loading leaderboard…</span>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div
        className="mt-10 flex flex-col items-center gap-2 py-10 rounded-2xl text-center"
        style={{
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        <Trophy size={28} style={{ color: "#f97316" }} />
        <p className="font-bold text-gray-600">No entries yet</p>
        <p className="text-xs text-gray-400">Be the first to complete this quiz!</p>
      </div>
    )
  }

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          style={{
            background: "linear-gradient(135deg, #fff3e0, #ffe0cc)",
            border: "1px solid #fed7aa",
          }}
        >
          <Trophy size={20} style={{ color: "#f97316" }} />
        </div>
        <div>
          <h2
            className="text-xl sm:text-2xl font-extrabold"
            style={{ color: "#1a1a2e", fontFamily: "'Sora', 'Nunito', sans-serif" }}
          >
            Leaderboard
          </h2>
          <p className="text-xs text-gray-400">{data.length} competitor{data.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Top 3 podium (only if ≥ 3 entries) */}
      {data.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {[data[1], data[0], data[2]].map((entry, podiumIdx) => {
            const heights = ["h-20", "h-28", "h-20"]
            const cfg = getRankDisplay(entry.rank)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: podiumIdx * 0.1 }}
                className={`flex flex-col items-center justify-end ${heights[podiumIdx]} rounded-2xl pt-3 pb-3 px-2 text-center`}
                style={{
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.border}`,
                  boxShadow: entry.rank === 1 ? "0 4px 20px rgba(245,158,11,0.25)" : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <p
                  className="text-xs font-extrabold mt-1 truncate max-w-full px-1"
                  style={{ color: "#1a1a2e", fontFamily: "'Sora', sans-serif" }}
                >
                  {(entry.user.name || entry.user.email).split(" ")[0]}
                </p>
                <p className="text-[10px] font-bold" style={{ color: cfg.color }}>
                  {entry.percentage}%
                </p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2 sm:space-y-3">
        {data.map((entry, i) => {
          const isCurrentUser = session?.user?.id === entry.user.id
          const cfg = getRankDisplay(entry.rank)
          const initials = (entry.user.name || entry.user.email)
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, ease: "easeOut" }}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-200"
              style={{
                background: isCurrentUser
                  ? "linear-gradient(90deg, #fff8f0, #fff3e0)"
                  : "rgba(255,255,255,0.82)",
                border: isCurrentUser
                  ? "1.5px solid #fed7aa"
                  : "1px solid rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: isCurrentUser
                  ? "0 4px 16px rgba(249,115,22,0.15)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Rank badge */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: cfg.bg || "#f3f4f6",
                  border: `1px solid ${cfg.border || "#e5e7eb"}`,
                  color: cfg.color,
                }}
              >
                {cfg.icon}
              </div>

              {/* Avatar */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                style={{
                  background: isCurrentUser
                    ? "linear-gradient(135deg, #f97316, #e8372a)"
                    : "linear-gradient(135deg, #94a3b8, #64748b)",
                }}
              >
                {initials}
              </div>

              {/* Name & accuracy */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm sm:text-base font-extrabold truncate"
                    style={{ color: "#1a1a2e", fontFamily: "'Sora', 'Nunito', sans-serif" }}
                  >
                    {entry.user.name || entry.user.email}
                  </p>
                  {isCurrentUser && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "linear-gradient(90deg, #f97316, #e8372a)",
                        color: "white",
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap size={10} style={{ color: cfg.color || "#9ca3af" }} />
                  <p className="text-[11px] text-gray-400 font-medium">
                    {entry.percentage}% accuracy
                  </p>
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p
                  className="text-sm sm:text-base font-extrabold"
                  style={{
                    color: isCurrentUser ? "#f97316" : "#1a1a2e",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {entry.score}/{entry.total}
                </p>
                <p className="text-[10px] text-gray-400">points</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}