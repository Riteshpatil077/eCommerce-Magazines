"use server"

import { prisma } from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        })

        // Refresh the page data without a full reload
        revalidatePath("/dashboard/admin/users")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete user" }
    }
}