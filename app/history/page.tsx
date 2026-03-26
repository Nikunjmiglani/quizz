"use client"

import { useEffect, useState } from "react"

export default function History() {
  const [attempts, setAttempts] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/api/history")
      const data = await res.json()
      setAttempts(data.data || [])
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Attempts</h1>

      {attempts.length === 0 && (
        <p className="text-gray-500">No attempts yet</p>
      )}

      <div className="space-y-4">
        {attempts.map((a) => (
          <div key={a.id} className="p-4 border rounded shadow">
            <p className="font-semibold">{a.quiz.title}</p>
            <p>Score: {a.score}</p>
            <p className="text-sm text-gray-500">
              {new Date(a.startedAt).toLocaleString()}
            </p>

            {a.suspicious && (
              <p className="text-red-500 mt-1">
                ⚠ Suspicious attempt
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}