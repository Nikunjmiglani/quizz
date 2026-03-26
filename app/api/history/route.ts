import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return Response.json({ success: false }, { status: 401 })
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