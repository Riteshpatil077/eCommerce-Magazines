import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, price, coverImage, pdfUrl } = body

    const updatedMagazine = await prisma.magazine.update({
      where: { id },
      data: {
        title,
        price: parseFloat(price),
        coverImage,
        pdfUrl,
      },
    })

    return NextResponse.json(updatedMagazine)
  } catch (error: any) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}