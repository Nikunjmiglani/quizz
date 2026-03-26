"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ResultPage() {
  const params = useSearchParams()
  const attemptId = params.get("attemptId")

  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    async function fetchResult() {
      const res = await fetch(
        `http://localhost:3000/api/attempt/${attemptId}`
      )
      const data = await res.json()
      setResult(data.data)
    }

    if (attemptId) fetchResult()
  }, [attemptId])

  if (!result) return <div className="p-6">Loading...</div>

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>

      <p className="text-xl">
        Score: {result.score} / {result.total}
      </p>

      <p className="mt-4 text-gray-500">
        Accuracy: {((result.score / result.total) * 100).toFixed(2)}%
      </p>

      {result.suspicious && (
        <p className="text-red-500 mt-2">
          ⚠ Suspicious activity detected
        </p>
      )}
    </div>
  )
}