import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Link from "next/link"

export default async function SubscriptionsPage() {
const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!)

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: decoded.id },
    include: { magazine: true },
  })

  return (
    <div className="space-y-6">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">
            {sub.magazine.title}
          </h3>

          <p>Status: 
            <span
              className={`ml-2 font-semibold ${
                sub.paymentStatus === "APPROVED"
                  ? "text-green-600"
                  : sub.paymentStatus === "PENDING"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {sub.paymentStatus}
            </span>
          </p>

          {sub.paymentStatus === "APPROVED" && (
            <Link
              href={`/store/${sub.magazine.slug}`}
              className="inline-block mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Read Magazine
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}