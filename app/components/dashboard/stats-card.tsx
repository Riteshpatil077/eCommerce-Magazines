import { ReactNode } from "react"

export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="text-indigo-600">{icon}</div>
    </div>
  )
}