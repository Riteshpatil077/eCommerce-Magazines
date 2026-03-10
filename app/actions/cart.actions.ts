"use server"

import { prisma } from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

/**
 * Helper securely extracts and verifies the user ID from the encrypted JWT token stored in cookies.
 * @returns The decoded user object if authorized, otherwise null.
 */
async function getUserFromToken() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
        return decoded
    } catch {
        return null
    }
}

/**
 * Server Action: Adds a magazine to the authenticated user's cart.
 * Prevents duplicating magazines in the cart and subsequently refreshes UI cache.
 * @param formData - Form data containing the magazineId from the client payload.
 */
export async function addToCart(formData: FormData) {
    const user = await getUserFromToken();
    if (!user) redirect("/login");

    const magazineId = formData.get("magazineId") as string;
    let shouldRedirect = false;

    try {
        const existing = await prisma.cart.findFirst({
            where: {
                userId: user.id,
                magazineId: magazineId,
            },
        });

        if (!existing) {
            await prisma.cart.create({
                data: {
                    userId: user.id,
                    magazineId: magazineId,
                },
            });
        }

        // Just revalidate the data so the UI updates
        revalidatePath("/dashboard/user/cart");
        revalidatePath("/store");

        // Return a JSON success flag to notify the toast/UI instead of rigidly redirecting a user
        return { success: true };
    } catch (err) {
        console.error("Cart Error:", err);
        return { error: "Database error occurred" };
    }
}

/**
 * Server Action: Instantly removes a specific entry from the user's cart.
 * Flushes cache upon deletion to update the frontend visual count immediately.
 * @param cartId - the unique Cartesian primary key ID of the item to delete.
 */
export async function removeFromCart(cartId: string) {
    const user = await getUserFromToken()
    if (!user) redirect("/login")

    try {
        await prisma.cart.delete({
            where: { id: cartId },
        })
    } catch (err) {
        return { error: "Database error occurred" }
    }

    revalidatePath("/dashboard/user/cart")
}