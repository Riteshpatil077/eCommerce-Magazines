import { NextResponse } from "next/server"
//import { writeFile, mkdir } from "fs/promises"
//import path from "path"
import { put } from "@vercel/blob"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

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

    const data = await req.formData()
    const file = data.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Upload the file directly to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json({
      message: "Upload successful",
      fileUrl: blob.url,
    })
  } catch (error) {
    console.error("UPLOAD ERROR:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}