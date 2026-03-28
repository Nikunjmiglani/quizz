import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

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

    // 🚀 Create attempt with total
    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        userId: session.user.id,
        startedAt: new Date(),
        endedAt: null,
        score: 0,
        total, // ✅ REQUIRED FIX
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