"use server"
import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

/**
 * Server Action: Permanently deletes a specific magazine from the database.
 * Revalidates the active frontend paths so changes instantly reflect on client-side renders.
 * @param id - The UUID identifier of the magazine entry in the database.
 */
export async function deleteMagazine(id: string) {
    // 1. Delete from DB
    await prisma.magazine.delete({
        where: { id }
    });

    // 2. Clear the specific cache tag used in the Store Page
    revalidatePath("/store");
    revalidatePath("/dashboard/admin/magazines");
}