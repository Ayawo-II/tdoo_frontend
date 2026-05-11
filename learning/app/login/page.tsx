"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    const res = await fetch("https://tdoo-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || "Identifiants incorrects")
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Tdoo</span>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Bon retour !</h1>
        <p className="text-gray-500 text-sm mb-8">Connectez-vous à votre compte</p>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Champs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              placeholder="votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 text-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 text-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium mt-6 hover:bg-indigo-700 transition-colors"
        >
          Se connecter
        </button>

        {/* Lien register */}
        <p className="text-center text-sm text-gray-800 mt-6">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            S'inscrire
          </a>
        </p>

      </div>
    </div>
  )
}