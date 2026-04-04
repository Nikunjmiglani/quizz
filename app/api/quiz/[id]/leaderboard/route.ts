import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const quizId = context.params.id

    if (!quizId) {
      return NextResponse.json(
        { success: false, message: "Quiz ID missing" },
        { status: 400 }
      )
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        quizId,
        endedAt: { not: null }, // only completed attempts
        // ❗ temporarily REMOVE this if debugging:
        // suspicious: false,
      },
      orderBy: [
        { score: "desc" },
        { createdAt: "asc" },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // 🧠 best attempt per user
    const bestAttemptsMap = new Map<string, typeof attempts[0]>()

    for (const attempt of attempts) {
      const existing = bestAttemptsMap.get(attempt.userId)

      if (!existing || attempt.score > existing.score) {
        bestAttemptsMap.set(attempt.userId, attempt)
      }
    }

    const leaderboard = Array.from(bestAttemptsMap.values())
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        )
      })
      .slice(0, 10)
      .map((entry, index) => ({
        rank: index + 1,
        id: entry.id,
        score: entry.score,
        total: entry.total,
        percentage: Math.round((entry.score / entry.total) * 100),
        user: entry.user,
      }))

    return NextResponse.json({
      success: true,
      leaderboard,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}