import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 🔒 Must be logged in
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { quizId } = await req.json()

    if (!quizId) {
      return Response.json(
        { success: false, message: "Quiz ID required" },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return Response.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      )
    }

    const total = quiz.questions.length

    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score: 0,
        total,
        startedAt: new Date(),
        endedAt: null,
      },
    })

    return Response.json({
      success: true,
      attemptId: attempt.id,
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}