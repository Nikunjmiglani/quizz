import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  })

  if (!attempt) {
    return Response.json({ success: false }, { status: 404 })
  }

  return Response.json({
    success: true,
    data: {
      score: attempt.score,
      total: attempt.quiz.questions.length,
      suspicious: attempt.suspicious,
    },
  })
}