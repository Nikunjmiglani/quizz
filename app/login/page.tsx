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
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2"
      >
        Login
      </button>
      <p className="text-sm">
  Don't have an account?{" "}
  <a href="/signup" className="text-blue-500 underline">
    Signup
  </a>
</p>
    </div>
  )
}