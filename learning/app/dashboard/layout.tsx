"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, CheckSquare, CalendarDays, LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const [user, setUser] = useState<{username: string} | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const navItems = [
    { href: "/dashboard", label: "Accueil", icon: <LayoutDashboard /> },
    { href: "/dashboard/today", label: "Aujourd'hui", icon: <Calendar /> },
    { href: "/dashboard/tasks", label: "Mes tâches", icon: <CheckSquare /> },
    { href: "/dashboard/calendar", label: "Calendrier", icon: <CalendarDays /> },
  ]
  

  return (
    <div className="flex h-screen bg-gray-50">

      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-indigo-900 flex flex-col transition-all duration-300`}>

        <div className="p-6 border-b border-indigo-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-white text-lg">Tdoo</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href ? "bg-indigo-600 text-white font-medium" : "text-indigo-200 hover:bg-indigo-600 hover:text-white"}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={() => {
              if(confirm("Voulez-vous vraiment vous déconnecter ?")){
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
              }
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-indigo-200 hover:bg-indigo-600 hover:text-white w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>

      </aside>

      <div className="flex-1 flex flex-col overflow-auto">

        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          {/* Bouton menu à gauche */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>

          {/* Utilisateur à droite */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {user?.username || "Utilisateur"}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  )
}