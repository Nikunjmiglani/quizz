import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params 

    const attempt = await prisma.attempt.findUnique({
      where: { id },
    })

    if (!attempt) {
      return Response.json(
        { success: false, message: "Attempt not found" },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      data: {
        score: attempt.score,
        total: attempt.total,
        suspicious: attempt.suspicious,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false },
      { status: 500 }
    )
  }
}