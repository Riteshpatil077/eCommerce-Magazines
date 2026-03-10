"use server"

import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

/**
 * Server Action: Processes a user's subscription request for a specific magazine.
 * Deducts 1 stock count, writes an upsert pending order record, and defines a 1-month expiry framework.
 * @param formData - Raw HTML Form Data payload containing the target magazineId.
 */
export async function subscribeAction(formData: FormData) {
  const magazineId = formData.get("magazineId") as string
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) redirect("/login")

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    userId = decoded.id
  } catch (err) {
    redirect("/login")
  }

  // 1. Calculate Start and Expiry (1 month from now)
  const startDate = new Date()
  const expiryDate = new Date()
  expiryDate.setMonth(expiryDate.getMonth() + 1) // Handles 30/31 days and leap years automatically

  // 2. Database Update
  // We use a transaction to ensure we decrement stock and create the subscription safely
  const [sub] = await prisma.$transaction([
    prisma.subscription.upsert({
      where: {
        userId_magazineId: {
          userId: userId,
          magazineId: magazineId,
        },
      },
      update: {
        isActive: false,       // Stays false until Admin approves
        paymentStatus: "PENDING",
        startDate: startDate,
        expiryDate: expiryDate,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        magazineId: magazineId,
        isActive: false,
        paymentStatus: "PENDING",
        startDate: startDate,
        expiryDate: expiryDate,
      },
      include: { magazine: true } // Grab the slug while we're at it
    }),
    prisma.magazine.update({
      where: { id: magazineId },
      data: { stock: { decrement: 1 } }
    })
  ])
  // 3. Clear Cache and Redirect
  revalidatePath("/dashboard/user")

  // Note: Usually, you'd redirect to a "Payment Pending" or "Order Summary" page 
  // since isActive is false, they won't be able to read yet.
  redirect(`/dashboard/user?status=pending`)
}