import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default async function ProfilePage() {
const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!)

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  )
}