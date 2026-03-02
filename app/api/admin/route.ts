import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user: any = jwt.verify(token, process.env.JWT_SECRET!)

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()

    const magazine = await prisma.magazine.create({
      data: {
        title: body.title,
        price: body.price,
        pdfUrl: body.pdfUrl,
        coverImage: body.coverImage,
      },
    })

    return NextResponse.json(
      { message: "Magazine created", magazine },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}