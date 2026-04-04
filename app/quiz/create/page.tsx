"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Send, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Zap } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = {
  question: string
  options: string[]
  answer: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OPTION_LETTERS = ["A", "B", "C", "D"]

function emptyQuestion(): QuestionType {
  return { question: "", options: ["", "", "", ""], answer: "" }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
      {text}
    </p>
  )
}

function Field({
  placeholder,
  value,
  onChange,
  multiline = false,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  const base =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"

  if (multiline)
    return (
      <textarea
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} resize-none`}
      />
    )

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateQuizPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuestionType[]>([emptyQuestion()])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})

  // ── Question helpers ─────────────────────────────────────────────────────

  const handleQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()])
    // Auto-expand the new question
    setCollapsed((prev) => ({ ...prev, [questions.length]: false }))
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }, 100)
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    setCollapsed((prev) => {
      const next: Record<number, boolean> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k)
        if (ki < index) next[ki] = v
        else if (ki > index) next[ki - 1] = v
      })
      return next
    })
  }

  const toggleCollapse = (index: number) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const isQuestionComplete = (q: QuestionType) =>
    q.question.trim() &&
    q.options.every((o) => o.trim()) &&
    q.answer.trim()

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError("")
    if (!title.trim()) { setError("Quiz title is required."); return }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) { setError(`Question ${i + 1} is empty.`); return }
      if (q.options.some((o) => !o.trim())) { setError(`All options in Q${i + 1} must be filled.`); return }
      if (!q.answer.trim()) { setError(`Q${i + 1} is missing a correct answer.`); return }
    }

    setSubmitting(true)
    const res = await fetch("/api/quiz/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, questions }),
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      setError("Failed to create quiz. Please try again.")
      setSubmitting(false)
    }
  }

  const completedCount = questions.filter(isQuestionComplete).length

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

          {/* ── Page header ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              <Zap size={11} className="text-orange-500" />
              Creator Studio
            </div>
            <h1
              className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Create a New Quiz
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Fill in the details below and add your questions.
            </p>
          </motion.div>

          {/* ── Quiz details card ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 rounded-3xl border border-white/90 bg-white/80 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-8"
          >
            <h2
              className="mb-5 text-base font-bold text-gray-800"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Quiz Details
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <Label text="Title" />
                <Field placeholder="e.g. World Geography Basics" value={title} onChange={setTitle} />
              </div>
              <div>
                <Label text="Description (optional)" />
                <Field
                  placeholder="A short description of what this quiz covers…"
                  value={description}
                  onChange={setDescription}
                  multiline
                />
              </div>
            </div>
          </motion.div>

          {/* ── Progress bar ─────────────────────────────────────────────── */}
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-gray-400">
            <span>{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
            <span>{completedCount}/{questions.length} complete</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: questions.length > 0 ? `${(completedCount / questions.length) * 100}%` : "0%",
                background: "linear-gradient(90deg,#f97316,#ef4444)",
              }}
            />
          </div>

          {/* ── Questions ────────────────────────────────────────────────── */}
          <AnimatePresence>
            {questions.map((q, qIndex) => {
              const complete  = isQuestionComplete(q)
              const isOpen    = !collapsed[qIndex]

              return (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-4 overflow-hidden rounded-3xl border border-white/90 bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                >
                  {/* Card header */}
                  <button
                    onClick={() => toggleCollapse(qIndex)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-orange-50/40"
                  >
                    <div className="flex items-center gap-3">
                      {/* Number badge */}
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
                      >
                        {qIndex + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-700 line-clamp-1">
                        {q.question.trim() || `Question ${qIndex + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {complete && (
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                      )}
                      {isOpen ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Card body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-4 px-6 pb-6">
                          {/* Divider */}
                          <div className="h-px bg-gray-100" />

                          {/* Question text */}
                          <div>
                            <Label text="Question" />
                            <Field
                              placeholder="Type your question here…"
                              value={q.question}
                              onChange={(v) => handleQuestionChange(qIndex, "question", v)}
                            />
                          </div>

                          {/* Options */}
                          <div>
                            <Label text="Options" />
                            <div className="flex flex-col gap-2">
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <span
                                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                                    style={{
                                      background: opt.trim()
                                        ? "linear-gradient(135deg,rgba(249,115,22,.15),rgba(239,68,68,.1))"
                                        : "rgba(0,0,0,.05)",
                                      color: opt.trim() ? "#c2410c" : "#9ca3af",
                                    }}
                                  >
                                    {OPTION_LETTERS[oIndex]}
                                  </span>
                                  <input
                                    type="text"
                                    placeholder={`Option ${OPTION_LETTERS[oIndex]}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Correct answer */}
                          <div>
                            <Label text="Correct Answer" />
                            <div className="relative">
                              <select
                                value={q.answer}
                                onChange={(e) => handleQuestionChange(qIndex, "answer", e.target.value)}
                                className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                              >
                                <option value="">Select the correct answer…</option>
                                {q.options.map((opt, i) => opt.trim() && (
                                  <option key={i} value={opt}>{OPTION_LETTERS[i]}: {opt}</option>
                                ))}
                              </select>
                              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>

                          {/* Remove button */}
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="flex items-center gap-1.5 self-start rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-100"
                            >
                              <Trash2 size={12} />
                              Remove question
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* ── Add question ─────────────────────────────────────────────── */}
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={addQuestion}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/60 py-4 text-sm font-semibold text-orange-600 transition-all duration-200 hover:border-orange-400 hover:bg-orange-50"
          >
            <Plus size={18} />
            Add Question
          </motion.button>

          {/* ── Error banner ─────────────────────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submit ───────────────────────────────────────────────────── */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold text-white shadow-[0_4px_18px_rgba(249,115,22,.32)] transition-all duration-200 hover:shadow-[0_8px_28px_rgba(249,115,22,.45)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Publishing…
              </>
            ) : (
              <>
                <Send size={16} />
                Publish Quiz
              </>
            )}
          </motion.button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Your quiz will be visible to all learners after publishing.
          </p>

        </div>
      </div>
    </>
  )
}