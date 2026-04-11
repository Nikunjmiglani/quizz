import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing token for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, email, expiresAt },
    })

   const resetUrl = `https://quizzkr.vercel.app/reset-password?token=${token}`

    await transporter.sendMail({
      from: `"QuizzKr" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your QuizzKr password",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#faf8f4;border-radius:16px;">
          <h2 style="font-size:22px;font-weight:800;color:#111;margin-bottom:4px;">Reset your password</h2>
          <p style="color:#555;font-size:14px;margin-bottom:28px;">
            We received a request to reset your <strong>QuizzKr</strong> password.
            Click the button below — this link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;font-weight:700;font-size:14px;border-radius:12px;text-decoration:none;">
            Reset Password
          </a>
          <p style="margin-top:28px;color:#aaa;font-size:12px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[forgot-password]", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}  