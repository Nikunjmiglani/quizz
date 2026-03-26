"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function AttemptsBarChart({ data }: { data: any[] }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="mb-4 font-semibold">Attempts per Quiz</h2>

      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="attempts" fill="#3b82f6" />
      </BarChart>
    </div>
  )
}