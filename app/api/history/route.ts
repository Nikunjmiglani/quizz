import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  const attempts = await prisma.attempt.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      quiz: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  })

  return Response.json({
    success: true,
    data: attempts,
  })
}