"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type QuestionType = {
  question: string
  options: string[]
  answer: string
}

export default function CreateQuizPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuestionType[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ])

  // ✅ ONLY for question + answer
  const handleQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  // ✅ separate handler for options
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ])
  }

  const handleSubmit = async () => {
    // 🔥 basic validation (don’t skip this)
    if (!title.trim()) return alert("Title required")

    for (const q of questions) {
      if (!q.question.trim()) return alert("Empty question found")
      if (q.options.some((opt) => !opt.trim()))
        return alert("All options must be filled")
      if (!q.answer.trim())
        return alert("Each question must have an answer")
    }

    const res = await fetch("/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, questions }),
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      alert("Failed to create quiz")
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      {/* Title */}
      <input
        className="w-full p-2 mb-3 bg-black border border-white/20 rounded"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description */}
      <input
        className="w-full p-2 mb-6 bg-black border border-white/20 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 border border-white/20 p-4 rounded">
          <input
            className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
            placeholder="Question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, "question", e.target.value)
            }
          />

          {/* Options */}
          {q.options.map((opt, oIndex) => (
            <input
              key={oIndex}
              className="w-full p-2 mb-1 bg-black border border-white/20 rounded"
              placeholder={`Option ${oIndex + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(qIndex, oIndex, e.target.value)
              }
            />
          ))}

          {/* Answer */}
          <input
            className="w-full p-2 mt-2 bg-black border border-white/20 rounded"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) =>
              handleQuestionChange(qIndex, "answer", e.target.value)
            }
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={addQuestion}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
        >
          Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold"
        >
          Create Quiz
        </button>
      </div>
    </div>
  )
}