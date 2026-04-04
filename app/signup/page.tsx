"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Lock, ArrowRight, UserPlus, Sparkles, AlertCircle, CheckCircle } from "lucide-react"

// ─── Password strength helper ─────────────────────────────────────────────────

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 8)        score++
  if (/[A-Z]/.test(pw))      score++
  if (/[0-9]/.test(pw))      score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score, label: "Weak",   color: "#ef4444" }
  if (score === 2) return { score, label: "Fair",   color: "#f97316" }
  if (score === 3) return { score, label: "Good",   color: "#f59e0b" }
  return              { score,     label: "Strong", color: "#22c55e" }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Signup() {
  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState(false)

  const strength = getStrength(password)

  const handleSignup = async () => {
    setError("")
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.")
      return
    }

    setLoading(true)
    try {
      const res  = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => { window.location.href = "/login" }, 1200)
      } else {
        setError(data.message || "Signup failed. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          backgroundColor: "#faf8f4",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 15% 0%,   rgba(251,191,36,.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 90% 10%,  rgba(249,115,22,.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 110%, rgba(14,165,233,.1)  0%, transparent 60%)
          `,
        }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(0,0,0,.07) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-amber-300/20 blur-[100px]" style={{ animationDuration: "16s" }} />
          <div className="absolute -right-32 top-0 h-[420px] w-[420px] animate-pulse rounded-full bg-orange-300/[.15] blur-[90px]" style={{ animationDuration: "20s", animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] animate-pulse rounded-full bg-sky-300/[.15] blur-[80px]" style={{ animationDuration: "14s", animationDelay: "4s" }} />
        </div>

        {/* Floating shapes */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {[
            { l: "6%",  t: "10%", s: 12, c: "#f97316", d: "7s",  dl: "0s"   },
            { l: "91%", t: "17%", s: 8,  c: "#0ea5e9", d: "9s",  dl: "1s"   },
            { l: "18%", t: "75%", s: 10, c: "#f59e0b", d: "6s",  dl: "0.5s" },
            { l: "80%", t: "65%", s: 7,  c: "#ef4444", d: "11s", dl: "2s"   },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                left: p.l, top: p.t,
                width: p.s, height: p.s,
                backgroundColor: p.c,
                animation: `floatS ${p.d} ease-in-out ${p.dl} infinite`,
                boxShadow: `0 0 ${p.s * 2}px ${p.c}60`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes floatS {
            0%,100% { transform: translateY(0); opacity: .4; }
            50%      { transform: translateY(-18px); opacity: .85; }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* ── Card ── */}
          <div className="rounded-3xl border border-white/90 bg-white/80 p-8 shadow-[0_8px_48px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-10">

            {/* Logo */}
            <Link href="/" className="mb-8 flex items-center justify-center gap-1">
              <span
                className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                QuizzKr
              </span>
              <span className="mb-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
            </Link>

            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                <Sparkles size={11} className="text-orange-500" />
                Free forever
              </div>
              <h1
                className="text-3xl font-extrabold tracking-tight text-gray-900"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Create your account
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Join thousands of learners competing today
              </p>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-3">

              {/* Name */}
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Password strength */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: n <= strength.score ? strength.color : "rgba(0,0,0,.08)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-right text-xs font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600"
                  >
                    <AlertCircle size={13} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-600"
                  >
                    <CheckCircle size={13} className="flex-shrink-0" />
                    Account created! Redirecting to login…
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignup}
                disabled={loading || success}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(249,115,22,.32)] transition-all duration-200 hover:shadow-[0_8px_28px_rgba(249,115,22,.45)] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    Create Account
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-300">
              <div className="h-px flex-1 bg-gray-100" />
              or
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p className="mt-5 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline transition hover:text-gray-600">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline transition hover:text-gray-600">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}