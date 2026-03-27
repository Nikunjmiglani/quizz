import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // ✅ Auth check
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ Role check (NO DB CALL)
    if (session.user.role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      )
    }

    const { title, questions } = await req.json()

    // ⚠️ basic validation (you skipped this)
    if (!title || !questions?.length) {
      return Response.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      )
    }

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
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}