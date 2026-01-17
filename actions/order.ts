"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

type OrderItemInput = {
    categoryName: string;
    price: number;
    quantity: number;
};

export async function createOrder(data: {
    supplierId: string;
    date: Date;
    notes?: string;
    items: OrderItemInput[];
}) {
    const { supplierId, date, notes, items } = data;

    // Calculate totals for items just to be sure, although we store them
    const itemsWithTotal = items.map((item) => ({
        ...item,
        total: item.price * item.quantity,
    }));

    await db.order.create({
        data: {
            supplierId,
            date,
            notes,
            items: {
                create: itemsWithTotal,
            },
        },
    });

    revalidatePath("/", "layout"); // Clears everything generally
    revalidatePath("/reports");     // Specific clear for reports
    revalidatePath("/orders");      // Specific clear for orders list
}

export async function getOrders(limit = 50) {
    return await db.order.findMany({
        take: limit,
        orderBy: { date: "desc" },
        include: {
            supplier: true,
            items: true,
        },
    });
}
