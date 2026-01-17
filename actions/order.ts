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

export async function deleteOrder(id: string) {
    await db.order.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/reports");
    revalidatePath("/orders");
}

export async function updateOrder(id: string, data: {
    supplierId: string;
    date: Date;
    notes?: string;
    items: OrderItemInput[];
}) {
    const { supplierId, date, notes, items } = data;

    // Transaction to replace items
    await db.$transaction(async (tx) => {
        // 1. Update basic info
        await tx.order.update({
            where: { id },
            data: { supplierId, date, notes },
        });

        // 2. Delete existing items
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        });

        // 3. Create new items
        const itemsWithTotal = items.map((item) => ({
            ...item,
            total: item.price * item.quantity,
            orderId: id,
        }));

        await tx.orderItem.createMany({
            data: itemsWithTotal,
        });
    });

    revalidatePath("/", "layout");
    revalidatePath("/reports");
    revalidatePath("/orders");
}

export async function getOrder(id: string) {
    return await db.order.findUnique({
        where: { id },
        include: {
            supplier: true,
            items: true,
        },
    });
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
