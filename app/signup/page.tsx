"use client"

import { useState } from "react"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (data.success) {
        alert("Signup successful! Now login.")
        window.location.href = "/login"
      } else {
        alert(data.message || "Signup failed")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/70 text-sm mt-1">
            Start your quiz journey 🚀
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
          />

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-2 bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition duration-200 shadow-md disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2 text-white/60 text-sm">
          <div className="flex-1 h-px bg-white/30" />
          OR
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Login Redirect */}
        <p className="text-center text-sm text-white/80">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-white font-semibold underline hover:text-purple-200 transition"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}