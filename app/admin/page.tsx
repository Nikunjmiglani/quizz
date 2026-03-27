"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<any[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ])
  const [loading, setLoading] = useState(false)

  // 🔥 PROTECTION
  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking access...
      </div>
    )
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ])
  }

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...questions]
    if (field === "question") updated[index].question = value
    if (field === "answer") updated[index].answer = value
    setQuestions(updated)
  }

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async () => {
    if (!title) {
      alert("Enter title")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      })

      const data = await res.json()

      if (data.success) {
        alert("Quiz created!")
        setTitle("")
        setQuestions([
          { question: "", options: ["", "", "", ""], answer: "" },
        ])
      } else {
        alert(data.message || "Error")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Admin Panel — Create Quiz
        </h1>

        <input
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 mb-8 rounded-lg bg-white/10 border border-white/20"
        />

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-white/5 p-5 rounded-xl border border-white/10"
            >
              <p className="text-sm text-gray-400 mb-2">
                Question {i + 1}
              </p>

              <input
                placeholder="Question"
                value={q.question}
                onChange={(e) =>
                  handleChange(i, "question", e.target.value)
                }
                className="w-full mb-4 px-3 py-2 rounded bg-white/10"
              />

              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt: string, j: number) => (
                  <input
                    key={j}
                    placeholder={`Option ${j + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(i, j, e.target.value)
                    }
                    className="px-3 py-2 rounded bg-white/10"
                  />
                ))}
              </div>

              <input
                placeholder="Correct Answer"
                value={q.answer}
                onChange={(e) =>
                  handleChange(i, "answer", e.target.value)
                }
                className="w-full mt-4 px-3 py-2 rounded bg-white/10"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={addQuestion}
            className="px-5 py-2 bg-white/10 rounded-lg"
          >
            + Add Question
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>

      </div>
    </div>
  )
}