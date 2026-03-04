"use server"

import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { registerSchema, loginSchema } from "@/app/lib/validations"

function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )
}

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

  // ✅ FIX: await cookies()
  const cookieStore = await cookies()

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect("/dashboard/user")
}

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
    maxAge: 60 * 60 * 24 * 7,
  })

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  redirect("/dashboard/user")
}

export async function logoutAction() {
  const cookieStore = await cookies()

  cookieStore.delete("token")

  redirect("/")
}