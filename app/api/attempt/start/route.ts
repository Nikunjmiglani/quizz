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

    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        userId: session.user.id,
        startedAt: new Date(),
        endedAt: null,
        score: 0,
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