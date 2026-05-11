"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ClipboardList, Clock, CheckCircle, Calendar } from "lucide-react"
import { getTasks } from "@/app/data/api"
import { Task } from "@/app/data/tasks"

const getLast8Days = () => {
  const days = []
  const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  
  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const nomJour = joursSemaine[date.getDay() === 0 ? 6 : date.getDay() - 1]
    
    const full = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
    days.push({ label: nomJour, full })
  }
  return days
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("fr-FR", { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getTasks(token).then(setTasks)
    }
  }, [])

  const enCours = tasks.filter(t => t.status === "in_progress")
  const aFaire = tasks.filter(t => t.status === "pending")
  const terminees = tasks.filter(t => t.status === "done")

  const pieData = [
    { name: "À faire", value: aFaire.length, color: "#6366f1" },
    { name: "En cours", value: enCours.length, color: "#f59e0b" },
    { name: "Terminées", value: terminees.length, color: "#22c55e" },
  ]

  const last8Days = getLast8Days()
  const barData = last8Days.map(day => ({
    date: day.label,
    taches: tasks.filter(t => t.createdAt?.startsWith(day.full)).length,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {new Date().toLocaleDateString("fr-FR", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{currentTime}</p>
        <p className="text-gray-400 text-xs mt-2">Voici un résumé de votre activité.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
          <p className="text-xs text-gray-400 mt-1">tâches au total</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">En cours</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{enCours.length}</p>
          <p className="text-xs text-gray-400 mt-1">en progression</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Terminées</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{terminees.length}</p>
          <p className="text-xs text-gray-400 mt-1">accomplies</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Répartition des tâches</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Tâches créées (8 derniers jours)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="taches" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}