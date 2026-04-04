"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Trophy, AlertTriangle, LayoutDashboard, Home, Target, CheckCircle2 } from "lucide-react"

export default function ResultPage() {
  const params = useSearchParams()
  const attemptId = params.get("attemptId")

  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    async function fetchResult() {
      const res = await fetch(`/api/attempt/${attemptId}`)
      const data = await res.json()
      setResult(data.data)
    }
    if (attemptId) fetchResult()
  }, [attemptId])

  if (!result)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#f97316", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-semibold text-gray-500 tracking-wide animate-pulse">
            Loading your result…
          </p>
        </div>
      </div>
    )

  const percentage = Math.round((result.score / result.total) * 100)

  const getPerformance = () => {
    if (percentage >= 80) return { label: "Excellent!", emoji: "🎯", color: "#16a34a" }
    if (percentage >= 60) return { label: "Good Job!", emoji: "👍", color: "#f97316" }
    if (percentage >= 40) return { label: "Decent Effort", emoji: "🤔", color: "#eab308" }
    return { label: "Needs Improvement", emoji: "📉", color: "#e8372a" }
  }

  const perf = getPerformance()

  // Arc SVG values
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl border border-white/80"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)" }}
        >
          {/* Top gradient banner */}
          <div
            className="h-2 w-full"
            style={{ background: "linear-gradient(90deg, #f97316, #e8372a, #d6396e)" }}
          />

          <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5">

            {/* Trophy icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg, #fff3e0, #ffe0cc)",
                border: "1px solid #fed7aa",
              }}
            >
              <Trophy size={28} style={{ color: "#f97316" }} />
            </div>

            {/* Heading */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ color: "#1a1a2e", fontFamily: "'Sora', 'Nunito', sans-serif" }}
              >
                Quiz Complete!
              </h1>
              <p className="text-sm text-gray-400 mt-1 tracking-wide">Here's how you did</p>
            </div>

            {/* Circular progress */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Track */}
                <circle
                  cx="60" cy="60" r={radius}
                  fill="none"
                  stroke="#f3e8d8"
                  strokeWidth="10"
                />
                {/* Progress */}
                <circle
                  cx="60" cy="60" r={radius}
                  fill="none"
                  stroke="url(#arcGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#e8372a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="relative flex flex-col items-center">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "#1a1a2e", fontFamily: "'Sora', sans-serif" }}
                >
                  {percentage}%
                </span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">Score</span>
              </div>
            </div>

            {/* Performance badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: `${perf.color}18`,
                color: perf.color,
                border: `1px solid ${perf.color}40`,
              }}
            >
              <span>{perf.emoji}</span>
              {perf.label}
            </div>

            {/* Stat row */}
            <div className="w-full grid grid-cols-2 gap-3">
              {[
                { icon: <CheckCircle2 size={16} />, label: "Correct", value: result.score, color: "#16a34a" },
                { icon: <Target size={16} />, label: "Total", value: result.total, color: "#f97316" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 rounded-2xl py-4 px-3"
                  style={{ background: "#faf5ee", border: "1px solid #f3e8d8" }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: "#1a1a2e", fontFamily: "'Sora', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Suspicious activity warning */}
            {result.suspicious && (
              <div
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#fff1f1",
                  border: "1px solid #fecaca",
                  color: "#e8372a",
                }}
              >
                <AlertTriangle size={16} />
                Suspicious activity was detected during this attempt.
              </div>
            )}

            {/* Divider */}
            <div className="w-full border-t border-gray-100" />

            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <a
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                style={{
                  background: "linear-gradient(90deg, #f97316, #e8372a)",
                  boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </a>

              <a
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "white",
                  border: "1.5px solid #e5e7eb",
                  color: "#374151",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Home size={16} />
                Home
              </a>
            </div>

          </div>
        </div>

        {/* Bottom social proof */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Keep competing — climb the{" "}
          <span
            className="font-bold"
            style={{
              background: "linear-gradient(90deg, #f97316, #e8372a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            QuizzKr
          </span>{" "}
          leaderboard!
        </p>
      </div>
    </div>
  )
}