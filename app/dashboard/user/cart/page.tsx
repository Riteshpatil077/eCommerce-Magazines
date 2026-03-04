import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { removeFromCart } from "@/app/actions/cart.actions"

async function getUser() {
    const token = (await cookies()).get("token")?.value
    if (!token) return null
    try {
        return jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
        return null
    }
}

export default async function CartPage() {
    const user: any = await getUser()
    if (!user) redirect("/login")

    const cartItems = await prisma.cart.findMany({
        where: { userId: user.id },
        include: { magazine: true },
    })

    return (
        <div className="min-h-screen bg-gray-900 p-10">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item: any) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-xl shadow flex justify-between"
                        >
                            <div>
                                <h2 className="font-semibold">
                                    {item.magazine.title}
                                </h2>
                                <p>₹{item.magazine.price}</p>
                            </div>
                            <form action={removeFromCart.bind(null, item.id)}>
                                <button type="submit" className="text-red-500 hover:text-red-700 text-sm">
                                    Remove
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}