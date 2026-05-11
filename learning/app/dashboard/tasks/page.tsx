"use client"

import { useState, useEffect } from "react"
import { getTasks, createTask, updateTask, deleteTask } from "@/app/data/api"
import { Task } from "@/app/data/tasks"
import { Calendar } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filtre, setFiltre] = useState("toutes")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (token) {
      getTasks(token).then((data) => {
        setTasks(data)
        setLoading(false)
      })
    }
  }, [token])

  async function handleCreate() {
    if (!token) return
    console.log("📅 dueDate avant envoi :", dueDate)
    await createTask(token, title, description, dueDate)
    setShowModal(false)
    setTitle("")
    setDescription("")
    setDueDate("")
    const data = await getTasks(token)
    setTasks(data)
  }

  async function handleUpdate() {
    if (!token || !selectedTask) return
    await updateTask(token, selectedTask.id, title, description, dueDate, selectedTask.status)
    setSelectedTask(null)
    setShowModal(false)
    setTitle("")
    setDescription("")
    setDueDate("")
    const data = await getTasks(token)
    setTasks(data)
  }

  async function handleDelete(id: number) {
    if (!token) return
    await deleteTask(token, id)
    const data = await getTasks(token)
    setTasks(data)
  }

  async function handleStatusChange(id: number, newStatus: string) {
  if (!token) return
  
  const taskToUpdate = tasks.find(t => t.id === id)
  if (!taskToUpdate) return
  
  await updateTask(
    token, 
    id, 
    taskToUpdate.title, 
    taskToUpdate.description || "", 
    taskToUpdate.dueDate || "", 
    newStatus
  )
  
  const data = await getTasks(token)
  setTasks(data)
}

  function ouvrirModification(task: Task) {
    setSelectedTask(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "")
    setShowModal(true)
  }

  function ouvrirCreation() {
    setSelectedTask(null)
    setTitle("")
    setDescription("")
    setDueDate("")
    setShowModal(true)
  }

  const tasksFiltrees = tasks.filter((task) => {
    if (filtre === "toutes") return true
    return task.status === filtre
  })

  return (
    <div className="flex gap-6 p-8">

      <div className="flex-1">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes tâches</h1>
            <p className="text-gray-500 text-sm mt-1">Organise tes tâches et sois plus productif.</p>
          </div>
          <button
            onClick={ouvrirCreation}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            + Nouvelle tâche
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          {[
            { label: "Toutes", value: "toutes" },
            { label: "À faire", value: "pending" },
            { label: "En cours", value: "in_progress" },
            { label: "Terminées", value: "done" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltre(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtre === f.value
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {loading && (
            <p className="text-center text-gray-400 py-12">Chargement...</p>
          )}
          {!loading && tasksFiltrees.length === 0 && (
            <p className="text-center text-gray-400 py-12">Aucune tâche pour ce filtre</p>
          )}
          {!loading &&
            tasksFiltrees.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                  selectedTask?.id === task.id ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    task.status === "done"
                      ? "bg-green-50 text-green-600"
                      : task.status === "in_progress"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {task.status === "done"
                    ? "Terminée"
                    : task.status === "in_progress"
                    ? "En cours"
                    : "À faire"}
                </span>

                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{task.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    <Calendar className="inline-block w-4 h-4 mr-1" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString("fr-FR") : "Pas de date"}
                    {task.description && ` · ${task.description}`}
                  </p>
                </div>

                {selectedTask?.id === task.id && (
                  <div className="flex gap-2 text-gray-400" onClick={(e) => e.stopPropagation()}>
                    {/* Selecteur de statut */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="pending">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminée</option>
                    </select>

                    <button
                      onClick={() => ouvrirModification(task)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if(confirm("Voulez-vous vraiment supprimer cette tâche ?")){
                          handleDelete(task.id)
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {selectedTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                  className="w-full border 
                  border-gray-300 
                  text-gray-800 
                  font-medium 
                  placeholder:text-gray-400 
                  focus:border-transparent 
                  rounded-lg px-4 
                  py-2.5 text-sm 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optionnelle)"
                  rows={3}
                  className="w-full border
                  border-gray-300 
                  text-gray-800 
                  font-medium 
                  placeholder:text-gray-400 
                  focus:border-transparent 
                  rounded-lg px-4 
                  py-2.5 text-sm 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date d'échéance</label>
                  <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {selectedTask && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Statut</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">À faire</option>
                    <option value="in_progress">En cours</option>
                    <option value="done">Terminée</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={selectedTask ? handleUpdate : handleCreate}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                {selectedTask ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}