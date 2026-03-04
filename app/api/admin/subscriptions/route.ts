// // import { NextResponse } from "next/server"
// // import { prisma } from "@/app/lib/prisma"
// // import { cookies } from "next/headers"
// // import jwt from "jsonwebtoken"

// // export async function GET() {
// //   try {
// //      const cookieStore = await cookies()
// //     const token = cookieStore.get("token")?.value
// //     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// //     const user: any = jwt.verify(token, process.env.JWT_SECRET!)
// //     if (user.role !== "ADMIN")
// //       return NextResponse.json({ error: "Forbidden" }, { status: 403 })

// //     const subscriptions = await prisma.subscription.findMany({
// //       include: {
// //         user: { select: { id: true, email: true } },
// //         magazine: { select: { id: true, title: true } },
// //       },
// //       orderBy: { createdAt: "desc" },
// //     })

// //     return NextResponse.json(subscriptions)
// //   } catch (err) {
// //     return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
// //   }
// // }



// // import { NextResponse } from "next/server"
// // import { prisma } from "@/app/lib/prisma"
// // import { cookies } from "next/headers"
// // import jwt from "jsonwebtoken"


// // // export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
// // //   try {

// // //     const { id } = await params;

// // //     const cookieStore = await cookies()
// // //     const token = cookieStore.get("token")?.value
// // //     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// // //     const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
// // //     if (admin.role !== "ADMIN")
// // //       return NextResponse.json({ error: "Forbidden" }, { status: 403 })

// // //     const body = await req.json()

// // //     // 2. Perform the update
// // //     const updated = await prisma.subscription.update({
// // //       where: { id: id }, // Uses the awaited ID
// // //       data: {
// // //         paymentStatus: body.paymentStatus,
// // //         isActive: body.isActive,
// // //         // Ensure expiryDate is handled safely
// // //         expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
// // //       },
// // //     })

// // //     return NextResponse.json(updated)
// // //   } catch (err: any) {
// // //     console.error("Update Error:", err.message)
// // //     return NextResponse.json({ error: "Update failed" }, { status: 500 })
// // //   }
// // // }

// // export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
// //   try {
// //     const { id } = await params;

// //     // Auth Check
// //     const cookieStore = await cookies()
// //     const token = cookieStore.get("token")?.value
// //     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// //     const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
// //     if (admin.role !== "ADMIN")
// //       return NextResponse.json({ error: "Forbidden" }, { status: 403 })

// //     const body = await req.json()

// //     // --- DATA CLEANING START ---
// //     const updateData: any = {}

// //     // Only update fields if they are actually provided in the body
// //     if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus
// //     if (body.isActive !== undefined) updateData.isActive = body.isActive

// //     // Crucial: Robust Date parsing
// //     if (body.expiryDate) {
// //       const parsedDate = new Date(body.expiryDate)
// //       if (!isNaN(parsedDate.getTime())) {
// //         updateData.expiryDate = parsedDate
// //       }
// //     } else if (body.expiryDate === null) {
// //       updateData.expiryDate = null // Handle clearing the date
// //     }
// //     // --- DATA CLEANING END ---

// //     const updated = await prisma.subscription.update({
// //       where: { id: id },
// //       data: updateData,
// //     })

// //     return NextResponse.json(updated)
// //   } catch (err: any) {
// //     // Check your terminal logs for this specific message!
// //     console.error("PRISMA FATAL ERROR:", err.message) 
// //     return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 })
// //   }
// // }
// import { NextResponse } from "next/server"
// import { prisma } from "@/app/lib/prisma"
// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"

// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params;

//     // 1. Authentication & Authorization Check
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 })
//     }

//     let admin: any;
//     try {
//       admin = jwt.verify(token, process.env.JWT_SECRET!)
//     } catch (jwtErr) {
//       return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 })
//     }

//     if (admin.role !== "ADMIN") {
//       return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
//     }

//     // 2. Parse and Clean Data
//     const body = await req.json()
//     const updateData: any = {}

//     if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus
//     if (body.isActive !== undefined) updateData.isActive = body.isActive

//     // Robust Date parsing
//     if (body.expiryDate) {
//       const parsedDate = new Date(body.expiryDate)
//       if (!isNaN(parsedDate.getTime())) {
//         updateData.expiryDate = parsedDate
//       }
//     } else if (body.expiryDate === null) {
//       updateData.expiryDate = null
//     }

//     // 3. Prisma Update Logic
//     // NOTE: If your Prisma schema uses an Int for the ID, use: where: { id: Number(id) }
//     // If using UUID/String, use: where: { id: id }
//     const updated = await prisma.subscription.update({
//       where: { id: id },
//       data: updateData,
//     })

//     return NextResponse.json(updated)

//   } catch (err: any) {
//     // This logs the EXACT error to your terminal (VS Code / CMD)
//     console.error("------- API ERROR START -------")
//     console.error("Message:", err.message)
//     console.error("Prisma Code:", err.code) // e.g., P2025 (Record not found)
//     console.error("------- API ERROR END -------")

//     return NextResponse.json({
//       error: "Update failed",
//       message: err.message,
//       prismaCode: err.code
//     }, { status: 500 })
//   }
// }

// export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params;

//     // Auth Check
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const admin: any = jwt.verify(token, process.env.JWT_SECRET!)
//     if (admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

//     await prisma.subscription.delete({
//       where: { id: id },
//     })

//     return NextResponse.json({ message: "Subscription deleted successfully" })
//   } catch (err: any) {
//     console.error("DELETE ERROR:", err.message)
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 })
//   }
// }

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