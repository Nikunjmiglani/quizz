"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"

export function IncreaseSizePieChart({ data }: { data: any }) {
  const chartData = [
    { name: "0-20", value: data["0-20"], fill: "#ef4444" },
    { name: "20-40", value: data["20-40"], fill: "#f97316" },
    { name: "40-60", value: data["40-60"], fill: "#eab308" },
    { name: "60-80", value: data["60-80"], fill: "#22c55e" },
    { name: "80-100", value: data["80-100"], fill: "#3b82f6" },
  ]

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-4 font-semibold">Score Distribution</h2>

      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  )
}