import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ success: false }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== "admin") {
      return Response.json({ success: false }, { status: 403 })
    }

    const { title, questions } = await req.json()

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
          })),
        },
      },
    })

    return Response.json({ success: true, quiz })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false }, { status: 500 })
  }
}