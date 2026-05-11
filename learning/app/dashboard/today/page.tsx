"use client"

import { useState, useEffect } from "react"
import { getTasks } from "@/app/data/api"
import { Task } from "@/app/data/tasks"
import { Calendar } from "lucide-react"

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getTasks(token).then((data) => {
        setTasks(data)
        setLoading(false)
      })
    }
  }, [])

  const tachesAujourdhui = tasks.filter(t => t.dueDate?.split("T")[0] === today)

  return (
    <div className="p-8">

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Aujourd'hui</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Chargement..." : `${tachesAujourdhui.length} tâche${tachesAujourdhui.length > 1 ? "s" : ""} prévue${tachesAujourdhui.length > 1 ? "s" : ""} pour aujourd'hui`}
        </p>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}
        {!loading && tachesAujourdhui.length === 0 && (
          <p className="text-center text-gray-400 py-12">Aucune tâche prévue pour aujourd'hui..</p>
        )}
        {!loading && tachesAujourdhui.map(task => (
          <div key={task.id} className="flex items-center gap-4 p-4">
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              task.status === "done"
                ? "bg-green-50 text-green-600"
                : task.status === "in_progress"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-blue-50 text-blue-600"
            }`}>
              {task.status === "done" ? "Terminée" : task.status === "in_progress" ? "En cours" : "À faire"}
            </span>
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{task.title}</p>
              {task.description && (
                <p className="text-gray-400 text-xs mt-1">{task.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}