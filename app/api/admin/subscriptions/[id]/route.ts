import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Standard Auth Helper to keep code clean
async function checkAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded.role === "ADMIN" ? decoded : null
  } catch {
    return null
  }
}

// --- UPDATE SUBSCRIPTION ---
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const updated = await prisma.subscription.update({
      where: { id: id },
      data: {
        paymentStatus: body.paymentStatus,
        isActive: body.isActive,
        // If expiryDate is passed, convert to Date object, otherwise ignore
        ...(body.expiryDate && { expiryDate: new Date(body.expiryDate) }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("Update Error:", err.message)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// --- DELETE SUBSCRIPTION ---
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete from DB
    await prisma.subscription.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (err: any) {
    console.error("Delete Error:", err.message)
    return NextResponse.json({ error: "Delete failed. Record may not exist." }, { status: 500 })
  }
}