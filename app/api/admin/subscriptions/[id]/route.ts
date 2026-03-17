import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer" // or your preferred mailer

// Initialize Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function checkAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded.role === "ADMIN" ? decoded : null
  } catch { return null }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await checkAdmin()
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()

    // 1. Fetch current subscription to get user details and current status
    const currentSub = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        magazine: { select: { title: true } }
      }
    })

    if (!currentSub) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // 2. Build update object
    const updateData: any = { updatedAt: new Date() }
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.expiryDate !== undefined) {
      updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null
    }

    // 3. Perform Update
    const updated = await prisma.subscription.update({
      where: { id },
      data: updateData,
    })

    // 4. Handle Notifications (Don't await this if you want faster responses, 
    // or keep it awaited to ensure delivery before finishing)
    const email = currentSub.user.email
    const title = currentSub.magazine.title

    // Case: Access Granted
    if (body.isActive === true && currentSub.isActive === false) {
      await transporter.sendMail({
        from: '"Magazine Support" <noreply@pressly.com>',
        to: email,
        subject: `Access Granted: ${title}`,
        text: `Your access to ${title} has been activated.`,
        html: `<h1>Access Granted</h1><p>Your subscription to <strong>${title}</strong> is now active. Enjoy reading!</p>`,
      })
    }
    // Case: Access Revoked
    else if (body.isActive === false && currentSub.isActive === true) {
      await transporter.sendMail({
        from: '"Magazine Support" <noreply@pressly.com>',
        to: email,
        subject: `Access Revoked: ${title}`,
        text: `Your access to ${title} has been revoked.`,
        html: `<h1>Access Revoked</h1><p>Your access to <strong>${title}</strong> has been deactivated by an administrator.<br> If any query please contact andministrator</p>`,
      })
    }

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("Update Error:", err.message)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// ... DELETE remains the same

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