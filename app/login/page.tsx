"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/70 text-sm mt-1">
            Login to your quiz dashboard
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
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
            onClick={handleLogin}
            className="mt-2 bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition duration-200 shadow-md"
          >
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2 text-white/60 text-sm">
          <div className="flex-1 h-px bg-white/30" />
          OR
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-white/80">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-white font-semibold underline hover:text-purple-200 transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}