"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1420,
  },
  {
    name: "Feb",
    total: 1620,
  },
  {
    name: "Mar",
    total: 1890,
  },
  {
    name: "Apr",
    total: 2390,
  },
  {
    name: "May",
    total: 2490,
  },
  {
    name: "Jun",
    total: 2980,
  },
  {
    name: "Jul",
    total: 3490,
  },
  {
    name: "Aug",
    total: 3120,
  },
  {
    name: "Sep",
    total: 3590,
  },
  {
    name: "Oct",
    total: 3890,
  },
  {
    name: "Nov",
    total: 4290,
  },
  {
    name: "Dec",
    total: 4390,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

