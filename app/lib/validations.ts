import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be 3 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})