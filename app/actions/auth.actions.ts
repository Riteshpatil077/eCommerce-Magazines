"use server"

import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/app/lib/validations"
import { sendEmail } from "@/app/lib/mail"

/**
 * Helper function to generate a JWT token for a user.
 * @param user - The user object containing id and role.
 * @returns A signed JWT token string valid for 1 day.
 */
function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  )
}

/**
 * Handles user registration.
 * Validates input, hashes password, saves user to DB, and sets a JWT cookie.
 */
export async function registerAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Email already exists" }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  const token = generateToken(user)
  const cookieStore = await cookies()

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, role: user.role };
}

/**
 * Handles user login.
 * Validates credentials and sets a JWT cookie upon success.
 */
export async function loginAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: "Invalid credentials" }

  const match = await bcrypt.compare(password, user.password)
  if (!match) return { error: "Invalid credentials" }

  const token = generateToken(user)
  const cookieStore = await cookies()

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 1, // 1 day
  })

  return { success: true, role: user.role };
}

/**
 * Logs out the user by clearing the JWT auth token cookie.
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  redirect("/")
}

/**
 * Initiates the forgot password flow.
 * Generates an OTP, stores it in the database with an expiration time,
 * and emails it directly to the user's provided email address.
 */
export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = forgotPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Return success even if user doesn't exist to prevent email enumeration attacks
    return { success: true, message: "If an account exists, an OTP has been sent." }
  }

  // Generate a random 6 digit OTP for the password reset sequence
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // Valid for 10 minutes

  // Save OTP variables directly against the user model record
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: otpExpiry
    }
  })

  // Dispatch standard nodemailer email using our custom utility
  const emailRes = await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    html: `<p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
  })

  if (!emailRes.success) {
    return { error: "Failed to send email. Please try again later." }
  }

  return { success: true, message: "If an account exists, an OTP has been sent." }
}

/**
 * Completes the forgot password flow.
 * Verifies the submitted OTP against the database and expiration limits.
 * If successful, securely updates the password and cleans up the OTP variables.
 */
export async function resetPasswordAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = resetPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, otp, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.resetPasswordOtp !== otp || !user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date()) {
    return { error: "Invalid or expired OTP" }
  }

  const hashed = await bcrypt.hash(password, 10)

  // Reset password to hash, and purge OTP parameters from record so they cannot be reused
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetPasswordOtp: null,
      resetPasswordOtpExpiry: null
    }
  })

  return { success: true, message: "Password has been successfully changed." }
}
