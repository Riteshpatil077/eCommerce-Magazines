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

  await prisma.subscription.create({
    data: {
      userId: user.id,
      magazineId,
    },
  })

  redirect(`/magazine/${magazineId}`)
}