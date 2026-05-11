"use client"

import { useState, useEffect } from "react"
import { getTasks } from "@/app/data/api"
import { Task } from "@/app/data/tasks"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getTasks(token).then((data) => {
        setTasks(data)
        setLoading(false)
      })
    }
  }, [])

  const monthName = currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null
    return dueDate.split("T")[0]
  }

  const fmt = (day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  const tachesSelectionnees = selectedDate
  ? tasks.filter(t => formatDueDate(t.dueDate) === selectedDate)
  : []

  const tachesParJour = (day: number) => tasks.filter(t => formatDueDate(t.dueDate) === fmt(day))


  const today = new Date().toISOString().split("T")[0]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-gray-500">Chargement du calendrier...</p>
      </div>
    )
  }

  return (
    <div className="p-8 flex gap-6">

      {/* Calendrier */}
      <div className="flex-1">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{monthName}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="px-3 py-1.5 border text-gray-500 border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* Grille calendrier */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(j => (
              <div key={j} className="p-3 text-center text-xs font-medium text-gray-500">
                {j}
              </div>
            ))}
          </div>

          {/* Cases du mois */}
          <div className="grid grid-cols-7">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border-b border-r border-gray-100 bg-gray-50" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = fmt(day)
              const taches = tachesParJour(day)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-24 border-b border-r border-gray-100 p-2 cursor-pointer transition-colors ${
                    isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium inline-flex w-6 h-6 items-center justify-center rounded-full ${
                    isToday ? "bg-indigo-600 text-white" : "text-gray-700"
                  }`}>
                    {day}
                  </span>

                  <div className="mt-1 space-y-0.5">
                    {taches.slice(0, 2).map(t => (
                      <div key={t.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${
                        t.status === "done"
                          ? "bg-green-50 text-green-700"
                          : t.status === "in_progress"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {t.title}
                      </div>
                    ))}
                    {taches.length > 2 && (
                      <p className="text-xs text-gray-400">+{taches.length - 2} autres</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Panneau latéral */}
      <div className="w-72">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font800 text-gray-800 mb900 mb-4">
            {selectedDate ? (
              <>
                <Calendar className="inline-block w-4 h-4 mr-1" /> {selectedDate}
              </>
            ) : "Sélectionne une date"}
          </h2>

          {!selectedDate && (
            <p className="text-gray-400 text-sm">Clique sur un jour pour voir ses tâches.</p>
          )}

          {selectedDate && tachesSelectionnees.length === 0 && (
            <p className="text-gray-400 text-sm">Aucune tâche ce jour-là.</p>
          )}

          <div className="space-y-3">
            {tachesSelectionnees.map(task => (
              <div key={task.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    task.status === "done"
                      ? "bg-green-50 text-green-600"
                      : task.status === "in_progress"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    {task.status === "done" ? "Terminée" : task.status === "in_progress" ? "En cours" : "À faire"}
                  </span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{task.title}</p>
                {task.description && (
                  <p className="text-gray-400 text-xs mt-1">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}