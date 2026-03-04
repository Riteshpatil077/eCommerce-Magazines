import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;
    
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (admin.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()

    // 2. Perform the update
    const updated = await prisma.subscription.update({
      where: { id: id }, // Uses the awaited ID
      data: {
        paymentStatus: body.paymentStatus,
        isActive: body.isActive,
        // Ensure expiryDate is handled safely
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("Update Error:", err.message)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params;
    
//     // Auth Check
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
//     if (admin.role !== "ADMIN")
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })

//     const body = await req.json()

//     // --- DATA CLEANING START ---
//     const updateData: any = {}
    
//     // Only update fields if they are actually provided in the body
//     if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus
//     if (body.isActive !== undefined) updateData.isActive = body.isActive
    
//     // Crucial: Robust Date parsing
//     if (body.expiryDate) {
//       const parsedDate = new Date(body.expiryDate)
//       if (!isNaN(parsedDate.getTime())) {
//         updateData.expiryDate = parsedDate
//       }
//     } else if (body.expiryDate === null) {
//       updateData.expiryDate = null // Handle clearing the date
//     }
//     // --- DATA CLEANING END ---

//     const updated = await prisma.subscription.update({
//       where: { id: id },
//       data: updateData,
//     })

//     return NextResponse.json(updated)
//   } catch (err: any) {
//     // Check your terminal logs for this specific message!
//     console.error("PRISMA FATAL ERROR:", err.message) 
//     return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 })
//   }
// }