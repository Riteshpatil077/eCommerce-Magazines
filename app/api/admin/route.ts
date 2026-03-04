import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin: any = jwt.verify(token, process.env.JWT_SECRET!)

    if (admin.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: { select: { email: true } },
        magazine: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(subscriptions)

  } catch (err: any) {
    console.error("GET ERROR:", err.message)
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}