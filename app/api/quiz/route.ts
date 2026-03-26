import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
          },
        },
      },
    });

    return Response.json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}