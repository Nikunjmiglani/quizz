"use client"

import { useState } from "react"

export default function AdminPage() {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<any[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ])
  }

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...questions]

    if (field === "question") {
      updated[index].question = value
    } else if (field === "answer") {
      updated[index].answer = value
    }

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
    const res = await fetch("/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, questions }),
    })

    const data = await res.json()

    if (data.success) {
      alert("Quiz created!")
      setTitle("")
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }])
    } else {
      alert("Error creating quiz")
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Create Quiz</h1>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {questions.map((q, i) => (
        <div key={i} className="mb-6 border p-4 rounded">
          <input
            placeholder="Question"
            value={q.question}
            onChange={(e) =>
              handleChange(i, "question", e.target.value)
            }
            className="border p-2 w-full mb-2"
          />

          {q.options.map((opt: string, j: number) => (
            <input
              key={j}
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(i, j, e.target.value)
              }
              className="border p-2 w-full mb-1"
            />
          ))}

          <input
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) =>
              handleChange(i, "answer", e.target.value)
            }
            className="border p-2 w-full mt-2"
          />
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-gray-200 px-3 py-1 rounded mr-3"
      >
        Add Question
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Quiz
      </button>
    </div>
  )
}