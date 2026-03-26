"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
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
      try {
        const res = await fetch("/api/dashboard", {
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Dashboard fetch failed")
        }

        const result = await res.json()

        if (result.success) {
          setData(result.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [status])

  if (status === "loading") {
    return <div className="p-6">Checking auth...</div>
  }

  if (!data) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome, {session?.user?.name}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">Total Attempts</p>
          <h2 className="text-2xl font-bold">{data.totalAttempts}</h2>
        </div>

        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">Average Score</p>
          <h2 className="text-2xl font-bold">{data.avgScore}%</h2>
        </div>

        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">Suspicious Attempts</p>
          <h2 className="text-2xl font-bold text-red-500">
            {data.suspiciousCount}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncreaseSizePieChart data={data.scoreBuckets} />
        <AttemptsBarChart data={data.attemptsPerQuiz} />
      </div>
    </div>
  )
}