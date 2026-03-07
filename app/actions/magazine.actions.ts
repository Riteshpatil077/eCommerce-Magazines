"use server"
import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

export async function deleteMagazine(id: string) {
    // 1. Delete from DB
    await prisma.magazine.delete({
        where: { id }
    });

    // 2. Clear the specific cache tag used in the Store Page
    revalidatePath("/store");
    revalidatePath("/dashboard/admin/magazines");
}