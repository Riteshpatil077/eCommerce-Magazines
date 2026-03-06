import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Standard Auth Helper
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

    // Build the data object dynamically
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Only update fields if they are explicitly provided in the request body
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Handle Date conversion safely
    if (body.expiryDate !== undefined) {
      updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    }

    const updated = await prisma.subscription.update({
      where: { id: id },
      data: updateData,
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