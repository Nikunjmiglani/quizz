"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [attemptId, setAttemptId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isCheating, setIsCheating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // INIT
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

  // TIMER
  useEffect(() => {
    if (!attemptId || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [attemptId, submitted])

  // ANTI-CHEAT
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setIsCheating(true)
    }

    const handleBlur = () => setIsCheating(true)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const handleSubmit = async () => {
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
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!quiz) return <div className="p-6">Quiz not found</div>

  const q = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6c8] to-[#f8f3ea] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {quiz.questions.map((_: any, i: number) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= currentQuestion ? "bg-yellow-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Timer + Cheat */}
        <div className="flex justify-between mb-4 text-sm">
          <p className="font-semibold text-gray-700">
            ⏱ {timeLeft}s
          </p>

          {isCheating && (
            <p className="flex items-center gap-1 text-red-600 font-semibold">
              <AlertTriangle size={16} /> Cheating detected
            </p>
          )}
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-center mb-6">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => {
              const selected = answers[q.id] === opt

              return (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  key={i}
                  onClick={() => handleSelect(q.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                    selected
                      ? "bg-yellow-400 text-black border-yellow-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span>{opt}</span>
                  {selected && <CheckCircle size={18} />}
                </motion.button>
              )
            })}
          </div>

          {/* Next / Submit */}
          <div className="mt-6 flex justify-center">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((p) => p + 1)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-semibold transition"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}