"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getReturns() {
    return await db.return.findMany({
        orderBy: { date: "desc" },
        include: {
            supplier: true,
        },
    });
}

export async function createReturn(data: {
    supplierId: string;
    categoryName: string;
    price: number;
    quantity: number;
    date: Date;
    reason?: string;
}) {
    await db.return.create({
        data: {
            supplierId: data.supplierId,
            categoryName: data.categoryName,
            price: data.price,
            quantity: data.quantity,
            date: data.date,
            reason: data.reason,
        },
    });
    revalidatePath("/returns");
    revalidatePath("/reports");
}

export async function deleteReturn(id: string) {
    await db.return.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/reports");
    revalidatePath("/returns");
}

export async function updateReturn(id: string, data: {
    categoryName: string;
    price: number;
    quantity: number;
    date: Date;
    reason?: string;
}) {
    await db.return.update({
        where: { id },
        data: {
            categoryName: data.categoryName,
            price: data.price,
            quantity: data.quantity,
            date: data.date,
            reason: data.reason,
        },
    });
    revalidatePath("/", "layout");
    revalidatePath("/reports");
    revalidatePath("/returns");
}
