"use client"

import { useEffect, useState } from "react"
import { use } from "react"

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [attemptId, setAttemptId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isCheating, setIsCheating] = useState(false)

  // INIT
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)

        const [quizRes, attemptRes] = await Promise.all([
          fetch(`/api/quiz/${id}`), // ✅ FIXED
          fetch("/api/attempt/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ✅ IMPORTANT
            body: JSON.stringify({ quizId: id }),
          }),
        ])

        const quizData = await quizRes.json()
        const attemptData = await attemptRes.json()

        if (!attemptData.success) {
          alert("Failed to start attempt")
          return
        }

        setQuiz(quizData.data)
        setAttemptId(attemptData.attemptId)

      } catch (error) {
        console.error(error)
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

  // 🚫 ANTI-CHEAT
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsCheating(true)
      }
    }

    const handleBlur = () => {
      setIsCheating(true)
    }

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

    try {
      const res = await fetch("/api/attempt/submit", { // ✅ FIXED
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ IMPORTANT
        body: JSON.stringify({
          attemptId,
          answers,
          isCheating,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)

        setTimeout(() => {
          window.location.href = `/quiz/${id}/result?attemptId=${attemptId}`
        }, 500)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!quiz) return <div className="p-6">Quiz not found</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      <p className="text-red-600 font-semibold mb-4">
        Time Left: {timeLeft}s
      </p>

      {isCheating && (
        <p className="text-red-600 font-bold mb-4">
          ⚠ Cheating detected!
        </p>
      )}

      {quiz.questions.map((q: any, index: number) => (
        <div key={q.id} className="mb-6">
          <p className="font-medium">
            {index + 1}. {q.question}
          </p>

          <div className="mt-2 space-y-2">
            {q.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleSelect(q.id, opt)}
                disabled={submitted}
                className={`block w-full text-left p-2 border rounded ${
                  answers[q.id] === opt
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!attemptId || submitted}
        className={`mt-6 px-6 py-3 text-white rounded ${
          attemptId && !submitted
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400"
        }`}
      >
        {submitted ? "Submitted" : "Submit Quiz"}
      </button>
    </div>
  )
}