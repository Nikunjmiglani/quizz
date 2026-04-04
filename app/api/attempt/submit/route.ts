import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { attemptId, answers, isCheating } = body

    if (!attemptId || !answers || typeof answers !== "object") {
      return Response.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      )
    }

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    })

    if (!attempt) {
      return Response.json(
        { success: false, message: "Attempt not found" },
        { status: 404 }
      )
    }

    // 🚫 prevent resubmission
    if (attempt.endedAt) {
      return Response.json(
        { success: false, message: "Already submitted" },
        { status: 400 }
      )
    }

    const now = new Date()
    const timeTaken =
      (now.getTime() - attempt.startedAt.getTime()) / 1000

    // ⛔ optional: time limit (keep or remove based on your quiz rules)
    if (timeTaken > 60) {
      return Response.json(
        { success: false, message: "Time exceeded" },
        { status: 400 }
      )
    }

    let score = 0

    for (const q of attempt.quiz.questions) {
      if (answers[q.id] === q.answer) {
        score++
      }
    }

    // ✅ realistic anti-cheat logic
    const suspicious =
      isCheating === true ||
      (timeTaken < 10 && score === attempt.quiz.questions.length)

    const updated = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score,
        total: attempt.quiz.questions.length,
        endedAt: new Date(),
        suspicious,
      },
    })

    return Response.json({
      success: true,
      score,
      total: attempt.quiz.questions.length,
      suspicious,
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}