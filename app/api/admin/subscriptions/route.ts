import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
     const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (user.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: { select: { id: true, email: true } },
        magazine: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(subscriptions)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}