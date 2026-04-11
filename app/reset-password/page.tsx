"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, ArrowRight, Sparkles, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.")
  }, [token])

  const handleReset = async () => {
    setError("")

    if (!password || !confirm) {
      setError("Please fill in both fields.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Strength indicator
  const strength = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" }
    if (password.length < 8) return { label: "Fair", color: "bg-amber-400", width: "w-1/2" }
    if (password.length < 12 || !/[^a-zA-Z0-9]/.test(password)) return { label: "Good", color: "bg-yellow-400", width: "w-3/4" }
    return { label: "Strong", color: "bg-green-400", width: "w-full" }
  })()

  return (
    <div className="rounded-3xl border border-white/90 bg-white/80 p-10 shadow-[0_8px_48px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">

      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center justify-center gap-1">
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent [font-family:'Syne',sans-serif]">
          QuizzKr
        </span>
        <span className="mb-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
      </Link>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center py-4"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 shadow-[0_4px_18px_rgba(249,115,22,0.18)]">
            <CheckCircle2 size={32} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 [font-family:'Syne',sans-serif]">
            Password updated!
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Redirecting you to sign in…
          </p>
          <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              <Sparkles size={11} className="text-orange-500" />
              Set new password
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 [font-family:'Syne',sans-serif]">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Choose a strong password for your account
            </p>
          </div>

          {/* Invalid token state */}
          {!token ? (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <XCircle size={28} className="text-red-400" />
              </div>
              <p className="text-sm text-gray-500">
                This reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
              >
                Request a new link →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {/* New password */}
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength bar */}
              {strength && (
                <div className="px-1">
                  <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${strength.color}`}
                    />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-gray-400">{strength.label}</p>
                </div>
              )}

              {/* Confirm password */}
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Match indicator */}
              {confirm.length > 0 && (
                <p className={`px-1 text-[11px] font-medium ${password === confirm ? "text-green-500" : "text-red-400"}`}>
                  {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 border border-red-100"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(249,115,22,0.32)] transition-all duration-200 hover:shadow-[0_8px_28px_rgba(249,115,22,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Updating…
                  </>
                ) : (
                  <>
                    Update password
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-300">
        <div className="h-px flex-1 bg-gray-100" />
        or
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
      >
        Back to sign in
      </Link>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf8f4] flex items-center justify-center px-4 py-12">

      {/* Mesh gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-amber-300/20 blur-[100px]" />
        <div className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-orange-300/15 blur-[90px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-sky-300/15 blur-[80px]" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-3 w-3 rotate-12 rounded-md bg-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
          style={{ animation: "float 7s ease-in-out infinite" }} />
        <div className="absolute right-[10%] top-[18%] h-2 w-2 rounded-full bg-sky-400/60 shadow-[0_0_10px_rgba(14,165,233,0.4)]"
          style={{ animation: "float 9s ease-in-out 1s infinite" }} />
        <div className="absolute bottom-[20%] left-[15%] h-2.5 w-2.5 rotate-45 rounded-sm bg-amber-400/50"
          style={{ animation: "float 6s ease-in-out 0.5s infinite" }} />
        <div className="absolute bottom-[30%] right-[8%] h-2 w-2 rounded-full bg-rose-400/50"
          style={{ animation: "float 8s ease-in-out 2s infinite" }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-18px) rotate(8deg); opacity: 0.9; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <Suspense fallback={<div className="rounded-3xl bg-white/80 p-10 text-center text-sm text-gray-400">Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-5 text-center text-xs text-gray-400">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600 transition">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-600 transition">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}