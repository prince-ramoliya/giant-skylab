"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    return await db.category.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createCategory(data: { name: string; defaultPrice: number }) {
    await db.category.create({
        data: {
            name: data.name,
            defaultPrice: data.defaultPrice,
        },
    });
    revalidatePath("/", "layout");
}

export async function deleteCategory(id: string) {
    // Check if used in orders? For now just soft delete or hard delete if unused.
    // MVP: Hard delete allowed if no constraints, or we should use active flag.
    // The schema has active flag, so let's toggle active.
    await db.category.update({
        where: { id },
        data: { active: false },
    });
    revalidatePath("/", "layout");
}
