"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Entry = {
  id: string
  rank: number
  score: number
  total: number
  percentage: number
  user: {
    id: string
    name: string
    email: string
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

  if (loading) return <p className="text-gray-400">Loading...</p>

  if (!data.length) return <p className="text-gray-400">No data yet</p>

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Leaderboard 🏆</h2>

      <div className="space-y-3">
        {data.map((entry) => {
          const isCurrentUser = session?.user?.id === entry.user.id

          return (
            <div
              key={entry.id}
              className={`flex justify-between items-center p-4 rounded border ${
                isCurrentUser
                  ? "bg-yellow-500/10 border-yellow-500"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">
                  #{entry.rank}
                </span>

                <div>
                  <p className="font-semibold">
                    {entry.user.name || entry.user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {entry.percentage}% accuracy
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  {entry.score}/{entry.total}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}