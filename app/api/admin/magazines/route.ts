

import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user: any = jwt.verify(token, process.env.JWT_SECRET!)

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()

    const baseSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    let slug = baseSlug
    let counter = 1

    while (await prisma.magazine.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const magazine = await prisma.magazine.create({
      data: {
        title: body.title,
        slug,
        description: body.description || null,
        coverImage: body.coverImage,
        pdfUrl: body.pdfUrl,
        price: Number(body.price),
        stock: parseInt(body.stock),
      },
    })

    // --- CACHE REVALIDATION ---
    // This tells Next.js to dump the old version of the store and fetch fresh data
    revalidatePath("/store")
    revalidateTag("magazines-list", "defaultTag")
    // --------------------------

    return NextResponse.json(
      { message: "Magazine created", magazine },
      { status: 201 }
    )
  } catch (error) {
    console.error("ADMIN MAGAZINE ERROR:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}