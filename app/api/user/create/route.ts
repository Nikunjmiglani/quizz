import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // ✅ Validation
    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    // ✅ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      )
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return Response.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}