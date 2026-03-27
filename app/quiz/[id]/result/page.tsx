"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        <p className="text-lg animate-pulse">Loading result...</p>
      </div>
    )

 const percentage = (result.score / result.total) * 100

  const getMessage = () => {
    if (percentage >= 80) return "Excellent 🎯"
    if (percentage >= 60) return "Good Job 👍"
    if (percentage >= 40) return "Decent 🤔"
    return "Needs Improvement 📉"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20 text-center">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Quiz Result
        </h1>

        <p className="text-white/70 mb-6">{getMessage()}</p>

        {/* Score Circle */}
        <div className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-inner">
          {percentage}%
        </div>

        {/* Stats */}
        <div className="text-white space-y-2">
          <p className="text-lg">
            Score: <span className="font-semibold">{result.score}</span> / {result.total}
          </p>
          <p className="text-sm text-white/70">
            Accuracy calculated based on correct answers
          </p>
        </div>

        {/* Warning */}
        {result.suspicious && (
          <div className="mt-4 text-red-300 text-sm font-medium">
            ⚠ Suspicious activity detected
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-center">
          <a
            href="/dashboard"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100 transition"
          >
            Dashboard
          </a>

          <a
            href="/"
            className="border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  )
}