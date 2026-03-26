import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return Response.json({ success: false }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { name, email },
    });

    return Response.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}