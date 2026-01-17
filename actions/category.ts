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

export async function updateCategory(id: string, name: string, defaultPrice: number) {
    await db.category.update({
        where: { id },
        data: { name, defaultPrice },
    });
    revalidatePath("/", "layout");
}

export async function deleteCategory(id: string) {
    await db.category.delete({
        where: { id },
    });
    revalidatePath("/", "layout");
}
