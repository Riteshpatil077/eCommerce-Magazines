"use server"

import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

export async function subscribeAction(formData: FormData) {
  const magazineId = formData.get("magazineId") as string

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) redirect("/login")

  const user: any = jwt.verify(token!, process.env.JWT_SECRET!)

  await prisma.subscription.upsert({
    where: {
      userId_magazineId: {
        userId: user.id,
        magazineId: magazineId,
      },
    },
    update: {
      isActive: true,
      paymentStatus: "APPROVED", // Or keep as PENDING depending on your flow
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      magazineId: magazineId,
      isActive: true,
      paymentStatus: "APPROVED",
    },
  })
  // Redirect back to the reader or a success page
  const magazine = await prisma.magazine.findUnique({ where: { id: magazineId } })
  redirect(`/dashboard/read/${magazine?.slug}`)
}