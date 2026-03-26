import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { attemptId, answers } = await req.json();

    if (!attemptId || !answers) {
      return Response.json({ success: false }, { status: 400 });
    }

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    });

    if (!attempt) {
      return Response.json({ success: false }, { status: 404 });
    }

    // 🚫 Prevent re-submission
    if (attempt.endedAt && attempt.score > 0) {
      return Response.json(
        { success: false, message: "Already submitted" },
        { status: 400 }
      );
    }

    // ⏱ Time check (60 sec limit)
    const now = new Date();
    const timeTaken =
      (now.getTime() - attempt.startedAt.getTime()) / 1000;

    if (timeTaken > 60) {
      return Response.json(
        { success: false, message: "Time exceeded" },
        { status: 400 }
      );
    }

    let score = 0;

    for (const q of attempt.quiz.questions) {
      if (answers[q.id] === q.answer) {
        score++;
      }
    }

    // 🚩 Suspicious detection
    const suspicious = timeTaken < 5;

    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score,
        endedAt: new Date(),
        suspicious,
      },
    });

    return Response.json({
      success: true,
      score,
      total: attempt.quiz.questions.length,
      suspicious,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}