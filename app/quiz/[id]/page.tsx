"use client"

import { useEffect, useState, useCallback } from "react"
import { use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertTriangle, ChevronRight, Send, Clock, Brain } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string
  question: string
  options: string[]
}

interface Quiz {
  title?: string
  questions: Question[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attemptId, setAttemptId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isCheating, setIsCheating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitted) return
    const res = await fetch("/api/attempt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ attemptId, answers, isCheating }),
    })
    const data = await res.json()
    if (data.success) {
      setSubmitted(true)
      setTimeout(() => {
        window.location.href = `/quiz/${id}/result?attemptId=${attemptId}`
      }, 800)
    }
  }, [attemptId, answers, isCheating, submitted, id])

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          fetch(`/api/quiz/${id}`),
          fetch("/api/attempt/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ quizId: id }),
          }),
        ])
        const quizData = await quizRes.json()
        const attemptData = await attemptRes.json()
        setQuiz(quizData.data)
        setAttemptId(attemptData.attemptId)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id])

  // ── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!attemptId || submitted) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [attemptId, submitted, handleSubmit])

  // ── Anti-cheat ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setIsCheating(true) }
    const onBlur = () => setIsCheating(true)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("blur", onBlur)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const totalQ        = quiz?.questions.length ?? 0
  const answeredCount = Object.keys(answers).length
  const timerPct      = (timeLeft / 60) * 100
  const timerColor    = timeLeft <= 10 ? "#ef4444" : timeLeft <= 20 ? "#f97316" : "#22c55e"
  const isLastQ       = quiz ? currentQuestion === totalQ - 1 : false
  const q             = quiz?.questions[currentQuestion]

  // ── Loading / error ─────────────────────────────────────────────────────────
  if (loading) return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#faf8f4" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500"
      />
    </div>
  )

  if (!quiz) return (
    <div
      className="flex min-h-screen items-center justify-center text-gray-500"
      style={{ backgroundColor: "#faf8f4" }}
    >
      Quiz not found.
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div
        className="relative min-h-screen overflow-x-hidden px-4 py-8 sm:px-6 sm:py-12"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          backgroundColor: "#faf8f4",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 15% 0%,   rgba(251,191,36,.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 90% 10%,  rgba(249,115,22,.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(14,165,233,.1)  0%, transparent 60%)
          `,
        }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(0,0,0,.07) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[400px] w-[400px] animate-pulse rounded-full bg-amber-300/20 blur-[90px]" style={{ animationDuration: "16s" }} />
          <div className="absolute -right-32 bottom-0 h-[350px] w-[350px] animate-pulse rounded-full bg-orange-300/[.15] blur-[80px]" style={{ animationDuration: "20s", animationDelay: "2s" }} />
        </div>

        <div className="mx-auto w-full max-w-2xl">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            {/* Logo / title */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
              >
                <Brain size={16} className="text-white" />
              </div>
              <span
                className="text-base font-extrabold bg-clip-text text-transparent hidden sm:block"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  backgroundImage: "linear-gradient(135deg,#f97316,#ef4444)",
                }}
              >
                {quiz.title ?? "Quiz"}
              </span>
            </div>

            {/* Timer + cheat badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isCheating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 sm:px-3"
                >
                  <AlertTriangle size={12} />
                  <span className="hidden sm:inline">Cheating detected</span>
                  <span className="sm:hidden">Cheat!</span>
                </motion.div>
              )}

              {/* Circular timer */}
              <div className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(0,0,0,.07)" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke={timerColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerPct / 100)}`}
                    style={{ transition: "stroke-dashoffset .9s linear, stroke .3s" }}
                  />
                </svg>
                <div className="flex flex-col items-center leading-none">
                  <Clock size={10} className="text-gray-400 mb-0.5" />
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: timerColor, fontFamily: "'Syne', sans-serif" }}
                  >
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Progress bar ─────────────────────────────────────────────── */}
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-400">
            <span>Question {currentQuestion + 1} of {totalQ}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="mb-6 flex gap-1.5">
            {quiz.questions.map((_: Question, i: number) => {
              const isDone     = i < currentQuestion
              const isCurrent  = i === currentQuestion
              const isAnswered = answers[quiz.questions[i].id] !== undefined
              return (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-all duration-500"
                  style={{
                    background:
                      isDone || isAnswered
                        ? "linear-gradient(90deg,#f97316,#ef4444)"
                        : isCurrent
                        ? "rgba(249,115,22,.35)"
                        : "rgba(0,0,0,.08)",
                  }}
                />
              )
            })}
          </div>

          {/* ── Question card ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {q && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-white/90 bg-white/80 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-8"
              >
                {/* Question number badge */}
                <div className="mb-5 flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                  >
                    Q{currentQuestion + 1}
                  </span>
                  {answers[q.id] && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle size={11} />
                      Answered
                    </span>
                  )}
                </div>

                {/* Question text */}
                <h2
                  className="mb-6 text-lg font-bold leading-snug text-gray-900 sm:text-xl"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {q.question}
                </h2>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {q.options.map((opt: string, i: number) => {
                    const selected = answers[q.id] === opt
                    const letter   = String.fromCharCode(65 + i) // A B C D

                    return (
                      <motion.button
                        key={i}
                        whileHover={!submitted ? { scale: 1.015, y: -1 } : {}}
                        whileTap={!submitted ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(q.id, opt)}
                        disabled={submitted}
                        className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed sm:text-base"
                        style={
                          selected
                            ? {
                                background: "linear-gradient(135deg,rgba(249,115,22,.12),rgba(239,68,68,.08))",
                                borderColor: "#f97316",
                                color: "#c2410c",
                                boxShadow: "0 2px 16px rgba(249,115,22,.18)",
                              }
                            : {
                                background: "white",
                                borderColor: "rgba(0,0,0,.08)",
                                color: "#374151",
                                boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                              }
                        }
                      >
                        {/* Letter badge */}
                        <span
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-8 sm:w-8"
                          style={
                            selected
                              ? { background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white" }
                              : { background: "rgba(0,0,0,.05)", color: "#6b7280" }
                          }
                        >
                          {letter}
                        </span>

                        <span className="flex-1">{opt}</span>

                        {selected && (
                          <CheckCircle size={18} className="flex-shrink-0 text-orange-500" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Nav buttons */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  {/* Back button */}
                  <button
                    onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-1.5 rounded-2xl border border-black/8 bg-white px-4 py-2.5 text-sm font-semibold text-gray-500 shadow-sm transition-all duration-200 hover:border-orange-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Back
                  </button>

                  {/* Next / Submit */}
                  {!isLastQ ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCurrentQuestion((p) => p + 1)}
                      className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(249,115,22,.42)] sm:px-8"
                      style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
                    >
                      Next
                      <ChevronRight size={16} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      disabled={submitted}
                      className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(22,163,74,.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(22,163,74,.4)] disabled:opacity-60 sm:px-8"
                      style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}
                    >
                      <Send size={15} />
                      {submitted ? "Submitting…" : "Submit Quiz"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Question dot nav (mobile-friendly) ──────────────────────── */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {quiz.questions.map((_: Question, i: number) => {
              const isAnswered = answers[quiz.questions[i].id] !== undefined
              const isCurrent  = i === currentQuestion
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200"
                  style={
                    isCurrent
                      ? { background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white", boxShadow: "0 2px 10px rgba(249,115,22,.35)" }
                      : isAnswered
                      ? { background: "rgba(249,115,22,.15)", color: "#c2410c", border: "1.5px solid rgba(249,115,22,.3)" }
                      : { background: "white", color: "#9ca3af", border: "1.5px solid rgba(0,0,0,.08)" }
                  }
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {/* ── Footer note ──────────────────────────────────────────────── */}
          <p className="mt-6 text-center text-xs text-gray-400">
            {answeredCount}/{totalQ} questions answered · Switching tabs may flag your attempt
          </p>

        </div>
      </div>
    </>
  )
}