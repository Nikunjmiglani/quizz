import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((quiz: any) => (
          <Card key={quiz.id} className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-gray-500 mt-2">
                {quiz.description}
              </p>

              <Link
                href={`/quiz/${quiz.id}`}
                className="mt-4 inline-block text-blue-600"
              >
                Start Quiz →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}