import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ success: false }, { status: 401 })
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    })

    const totalAttempts = attempts.length

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0)

    const totalQuestions = attempts.reduce(
      (sum, a) => sum + a.quiz.questions.length,
      0
    )

    const avgScore =
      totalAttempts > 0 ? (totalScore / totalQuestions) * 100 : 0

    const suspiciousCount = attempts.filter((a) => a.suspicious).length

    const scoreBuckets = {
      "0-20": 0,
      "20-40": 0,
      "40-60": 0,
      "60-80": 0,
      "80-100": 0,
    }

    attempts.forEach((a) => {
      const percentage =
        (a.score / a.quiz.questions.length) * 100

      if (percentage <= 20) scoreBuckets["0-20"]++
      else if (percentage <= 40) scoreBuckets["20-40"]++
      else if (percentage <= 60) scoreBuckets["40-60"]++
      else if (percentage <= 80) scoreBuckets["60-80"]++
      else scoreBuckets["80-100"]++
    })

    const attemptsPerQuizMap: Record<string, number> = {}

    attempts.forEach((a) => {
      const title = a.quiz.title

      if (!attemptsPerQuizMap[title]) {
        attemptsPerQuizMap[title] = 0
      }

      attemptsPerQuizMap[title]++
    })

    const attemptsPerQuiz = Object.entries(attemptsPerQuizMap).map(
      ([name, attempts]) => ({
        name,
        attempts,
      })
    )

    return Response.json({
      success: true,
      data: {
        totalAttempts,
        avgScore: avgScore.toFixed(2),
        suspiciousCount,
        scoreBuckets,
        attemptsPerQuiz,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false }, { status: 500 })
  }
}