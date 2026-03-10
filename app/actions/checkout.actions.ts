"use server"

import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

/**
 * Authenticates the user by decoding the JWT from their cookies.
 * @returns The user ID string if authenticated, or null if the token is missing/invalid.
 */
async function getUserId() {
    const token = (await cookies()).get("token")?.value
    if (!token) return null
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        return decoded.id
    } catch {
        return null
    }
}

/**
 * Server Action: Completes a checkout flow for the user's entire cart.
 * Moves cart items into a structured Order, creates pending Subscriptions, and flushes the cart.
 * Executes completely inside an atomic Prisma Transaction for rollback safety.
 * @param formData - The billing information securely passed from the checkout form.
 */
export async function processOrder(formData: FormData) {
    const userId = await getUserId()
    if (!userId) redirect("/login")

    // Extract billing inputs
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const zip = formData.get("zip") as string

    // 1. Fetch current cart items
    const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: { magazine: true }
    });

    if (cartItems.length === 0) {
        redirect("/store");
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + item.magazine.price, 0)

    // 2. Run everything in a single Transaction
    await prisma.$transaction(async (tx) => {
        // Create the main Order
        const order = await tx.order.create({
            data: {
                userId,
                amount: totalAmount,
                address: `${name}, ${address}, ${zip}`,
                phone: phone as string,
                // Create all OrderItems at once
                items: {
                    create: cartItems.map((item) => ({
                        magazineId: item.magazineId,
                        price: item.magazine.price,
                    })),
                },
            },
        });
        for (const item of cartItems) {
            const startDate = new Date();
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            await tx.subscription.upsert({
                where: {
                    userId_magazineId: {
                        userId: userId,
                        magazineId: item.magazineId,
                    },
                },
                update: {
                    isActive: false,
                    paymentStatus: "PENDING",
                    startDate,
                    expiryDate,
                },
                create: {
                    userId: userId,
                    magazineId: item.magazineId,
                    isActive: false,
                    paymentStatus: "PENDING",
                    startDate,
                    expiryDate,
                },
            });
        }

        // 3. Clear the user's cart
        await tx.cart.deleteMany({
            where: { userId }
        });
    });


    // 3. Redirect to a success page
    redirect("/dashboard/user?status=pending")
}