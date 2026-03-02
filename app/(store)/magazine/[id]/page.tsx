import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { notFound, redirect } from "next/navigation"
import { subscribeAction} from "../../../actions/subscription.actions"
async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}

export default async function MagazinePage({ params }: any) {
  const user: any = await getUserFromToken()

  if (!user) redirect("/login")

  const magazine = await prisma.magazine.findUnique({
    where: { id: params.id },
  })

  if (!magazine) notFound()

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      magazineId: magazine.id,
      paymentStatus: "APPROVED",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        
        <h1 className="text-3xl font-bold mb-4">
          {magazine.title}
        </h1>

        {subscription ? (
          <iframe
            src={magazine.pdfUrl}
            className="w-full h-[600px] rounded-lg"
          />
        ) : (
          <div>
            <p className="mb-4 text-gray-600">
              You need to subscribe to access this magazine.
            </p>

            <form action={subscribeAction}>
              <input
                type="hidden"
                name="magazineId"
                value={magazine.id}
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg"
              >
                Subscribe for ₹{magazine.price}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}