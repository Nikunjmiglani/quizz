import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, questions } = await req.json();

    if (!title || !questions) {
      return Response.json({ success: false }, { status: 400 });
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
      include: { questions: true },
    });

    return Response.json({ success: true, data: quiz });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}