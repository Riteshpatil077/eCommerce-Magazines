"use server"

import { prisma } from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

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

        // Return a success message instead of redirecting
        return { success: true };
    } catch (err) {
        console.error("Cart Error:", err);
        return { error: "Database error occurred" };
    }

    // // Perform revalidation and redirect OUTSIDE the try/catch
    // if (shouldRedirect) {
    //     revalidatePath("/dashboard/user/cart");
    //     revalidatePath("/store");
    //     redirect("/dashboard/user/cart");
    // }
}

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