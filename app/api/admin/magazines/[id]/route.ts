import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, price, stock, coverImage, pdfUrl } = body

    const updatedMagazine = await prisma.magazine.update({
      where: { id },
      data: {
        title,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        coverImage,
        pdfUrl,
      },
    })

    return NextResponse.json(updatedMagazine)
  } catch (error: any) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.magazine.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete magazine" }, { status: 500 })
  }
}


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isActive } = await req.json();

    const updated = await prisma.magazine.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


