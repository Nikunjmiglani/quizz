import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Brain, Clock } from "lucide-react"

async function getQuizzes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch quizzes")
  }

  const result = await res.json()
  return result.data
}

export default async function QuizListPage() {
  const quizzes = await getQuizzes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6c8] to-[#f8f3ea] p-6">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Explore Quizzes
        </h1>
        <p className="text-gray-600 mt-2">
          Test your knowledge, challenge yourself, and track your performance.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz: any) => (
          <div
            key={quiz.id}
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition" />

            <Card className="relative bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all">
              <CardContent className="p-6 flex flex-col justify-between h-full">

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition">
                  {quiz.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {quiz.description}
                </p>

                {/* Meta Info (fake fallback if not present) */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Brain size={16} />
                    {quiz.questions?.length || 5} Qs
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    1 min
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-full transition group-hover:scale-105"
                >
                  Start Quiz
                  <ArrowRight size={16} />
                </Link>

              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}