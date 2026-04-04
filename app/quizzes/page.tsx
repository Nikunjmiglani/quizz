import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Brain, Clock, Zap } from "lucide-react"

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
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-10"
      style={{
        background: "linear-gradient(135deg, #f5e0b0 0%, #f8efe0 40%, #fce8d8 70%, #f9dfd0 100%)",
      }}
    >
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-orange-200 rounded-full px-3 py-1 mb-5 shadow-sm">
          <Zap size={13} className="text-orange-500" fill="currentColor" />
          <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
            All Quizzes
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
          style={{
            color: "#1a1a2e",
            fontFamily: "'Sora', 'Nunito', sans-serif",
          }}
        >
          Explore Quizzes.{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #f97316, #e8372a, #d6396e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Beat Everyone.
          </span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-xl">
          Take interactive quizzes, track your performance, and climb the leaderboard. Built for speed, fairness, and real competition.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {quizzes.map((quiz: any, index: number) => (
          <div
            key={quiz.id}
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Subtle warm glow on hover */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #e8372a 50%, #d6396e 100%)",
              }}
            />

            <Card
              className="relative rounded-2xl border border-white/80 shadow-md transition-all duration-300 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
            >
              {/* Top accent bar — cycles through brand gradient shades */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    index % 3 === 0
                      ? "linear-gradient(90deg, #f97316, #e8372a)"
                      : index % 3 === 1
                      ? "linear-gradient(90deg, #e8372a, #d6396e)"
                      : "linear-gradient(90deg, #f97316, #d6396e)",
                }}
              />

              <CardContent className="p-5 sm:p-6 flex flex-col gap-3">
                {/* Quiz number badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #fff3e0, #ffe0cc)",
                      color: "#f97316",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    Quiz #{String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question count pill */}
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Brain size={13} />
                    {quiz.questions?.length || 5} Qs
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-lg sm:text-xl font-extrabold leading-snug transition-colors duration-200"
                  style={{
                    color: "#1a1a2e",
                    fontFamily: "'Sora', 'Nunito', sans-serif",
                  }}
                >
                  {quiz.title}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {quiz.description}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1" />

                {/* Meta + CTA row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={13} />
                    ~{quiz.questions?.length || 5} min
                  </span>

                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="inline-flex items-center gap-1.5 font-bold text-sm px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 text-white shadow-md"
                    style={{
                      background: "linear-gradient(90deg, #f97316, #e8372a)",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                    }}
                  >
                    Start Quiz
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Bottom social proof — mirrors hero */}
      <div className="max-w-6xl mx-auto mt-12 flex items-center gap-3 justify-center flex-wrap">
        <div className="flex -space-x-2">
          {["#f97316", "#6366f1", "#a855f7", "#22c55e"].map((color, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              style={{ background: color }}
            >
              {["A", "B", "C", "D"][i]}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          Loved by <strong className="text-gray-700">learners</strong>
        </span>
      </div>
    </div>
  )
}