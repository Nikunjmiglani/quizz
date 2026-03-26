import Link from "next/link"

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Quiz Platform</h1>

      <Link
        href="/quizzes"
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Explore Quizzes
      </Link>
    </div>
  )
}