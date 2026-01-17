"use server";

import db from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";
import { Order, OrderItem, Return, Supplier } from "@prisma/client";

export async function getMonthlyReport(month: Date, supplierId?: string) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    const whereClause: any = {
        date: {
            gte: start,
            lte: end,
        },
    };

    if (supplierId && supplierId !== "all") {
        whereClause.supplierId = supplierId;
    }

    // 1. Fetch Orders
    const orders = await db.order.findMany({
        where: whereClause,
        include: {
            items: true,
            supplier: true,
        },
    });

    // 2. Fetch Returns
    const returns = await db.return.findMany({
        where: whereClause,
        include: {
            supplier: true,
        },
    });

    // 3. Aggregate Data
    let totalPieces = 0;
    let grossAmount = 0;
    const categoryBreakdown: Record<string, { quantity: number; amount: number; price: number }> = {};

    orders.forEach((order: Order & { items: OrderItem[]; supplier: Supplier; }) => {
        order.items.forEach((item: OrderItem) => {
            totalPieces += item.quantity;
            grossAmount += item.total;

            if (!categoryBreakdown[item.categoryName]) {
                categoryBreakdown[item.categoryName] = { quantity: 0, amount: 0, price: item.price };
            }
            categoryBreakdown[item.categoryName].quantity += item.quantity;
            categoryBreakdown[item.categoryName].amount += item.total;
        });
    });

    let totalReturnsQty = 0;
    let totalReturnsAmount = 0;

    returns.forEach((r: Return & { supplier: Supplier; }) => {
        const amount = r.price * r.quantity;
        totalReturnsQty += r.quantity;
        totalReturnsAmount += amount;
    });

    const netPayable = grossAmount - totalReturnsAmount;

    return {
        orders,
        returns,
        summary: {
            totalPieces,
            grossAmount,
            totalReturnsQty,
            totalReturnsAmount,
            netPayable,
        },
        categoryBreakdown,
    };
}
