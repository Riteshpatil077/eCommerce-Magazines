import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function PUT(req: Request, { params }: any) {
  try {
      const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (admin.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()

    const updated = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        paymentStatus: body.paymentStatus,
        isActive: body.isActive,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}