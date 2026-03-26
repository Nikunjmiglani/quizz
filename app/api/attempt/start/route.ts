import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, quizId } = await req.json();

    if (!userId || !quizId) {
      return Response.json({ success: false }, { status: 400 });
    }

    const existing = await prisma.attempt.findFirst({
      where: { userId, quizId },
    });

    if (existing) {
      return Response.json(
        { success: false, message: "Already attempted" },
        { status: 400 }
      );
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        quizId,
        score: 0,
        startedAt: new Date(),
        endedAt: new Date(),
      },
    });

    return Response.json({ success: true, data: attempt });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}