import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CREATOR") {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const creatorId = session.user.id

    const quizzes = await prisma.quiz.findMany({
      where: { creatorId },
      include: {
        attempts: true,
      },
    })

    const totalQuizzes = quizzes.length

    let totalAttempts = 0
    let totalScore = 0
    let totalQuestions = 0

    let topQuiz = {
      title: "",
      attempts: 0,
    }

    const quizStats = quizzes.map((quiz) => {
      const attempts = quiz.attempts.length

      totalAttempts += attempts

      if (attempts > topQuiz.attempts) {
        topQuiz = {
          title: quiz.title,
          attempts,
        }
      }

      let quizScore = 0
      let quizTotal = 0

      quiz.attempts.forEach((a) => {
        quizScore += a.score
        quizTotal += a.total
      })

      totalScore += quizScore
      totalQuestions += quizTotal

      return {
        title: quiz.title,
        attempts,
      }
    })

    const avgScore =
      totalQuestions === 0
        ? 0
        : Math.round((totalScore / totalQuestions) * 100)

    return Response.json({
      totalQuizzes,
      totalAttempts,
      avgScore,
      topQuiz,
      quizStats,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}