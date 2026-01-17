"use server";

import db from "@/lib/db";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format } from "date-fns";
import { Order, OrderItem, Supplier } from "@prisma/client";

export async function getDashboardMetrics() {
    const now = new Date();

    // Today's Orders
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const todayOrders = await db.order.findMany({
        where: { date: { gte: todayStart, lte: todayEnd } },
        include: { items: true },
    });

    const todayCount = todayOrders.length;
    const todayAmount = todayOrders.reduce((sum: number, order) => {
        return sum + order.items.reduce((s: number, i) => s + i.total, 0);
    }, 0);

    // Monthly stats
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthOrders = await db.order.findMany({
        where: { date: { gte: monthStart, lte: monthEnd } },
        include: { items: true, supplier: true },
    });

    const monthPieces = monthOrders.reduce((sum: number, order) => {
        return sum + order.items.reduce((s: number, i) => s + i.quantity, 0);
    }, 0);

    const monthAmount = monthOrders.reduce((sum: number, order) => {
        return sum + order.items.reduce((s: number, i) => s + i.total, 0);
    }, 0);

    // Top Supplier
    const supplierStats: Record<string, number> = {};
    monthOrders.forEach(order => {
        if (!supplierStats[order.supplier.name]) supplierStats[order.supplier.name] = 0;
        supplierStats[order.supplier.name] += order.items.reduce((s: number, i) => s + i.total, 0);
    });

    let maxVal = 0;
    let topSupplierName = "N/A";
    for (const [name, val] of Object.entries(supplierStats)) {
        if (val > maxVal) {
            maxVal = val;
            topSupplierName = name;
        }
    }

    // --- CHART DATA CALCULATIONS ---

    // 1. Revenue Trend (Last 7 Days)
    const sevenDaysAgo = subDays(now, 6);
    const last7DaysOrders = await db.order.findMany({
        where: { date: { gte: startOfDay(sevenDaysAgo) } },
        include: { items: true },
        orderBy: { date: 'asc' }
    });

    const revenueTrendMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
        const d = format(subDays(now, i), 'MMM dd');
        revenueTrendMap.set(d, 0);
    }
    last7DaysOrders.forEach(o => {
        const d = format(o.date, 'MMM dd');
        const total = o.items.reduce((sum, item) => sum + item.total, 0);
        revenueTrendMap.set(d, (revenueTrendMap.get(d) || 0) + total);
    });
    // Reverse to show oldest to newest if iterating backward, or just sort keys
    const revenueTrend = Array.from(revenueTrendMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .reverse();


    // 2. Category Sales (All time or Monthly - let's do Monthly for relevance)
    const monthlyOrdersForCharts = await db.order.findMany({
        where: { date: { gte: startOfMonth(now), lte: endOfMonth(now) } },
        include: { items: true }
    });
    const categorySalesMap = new Map<string, number>();
    monthlyOrdersForCharts.forEach(o => {
        o.items.forEach(i => {
            categorySalesMap.set(i.categoryName, (categorySalesMap.get(i.categoryName) || 0) + i.total);
        });
    });
    const categorySales = Array.from(categorySalesMap.entries())
        .map(([name, value]) => ({ name, value }));


    // 3. Top Sellers (Monthly)
    const topSellersMap = new Map<string, number>();
    // We need supplier names, so include supplier
    const monthlyOrdersWithSupplier = await db.order.findMany({
        where: { date: { gte: startOfMonth(now), lte: endOfMonth(now) } },
        include: { items: true, supplier: true }
    });
    monthlyOrdersWithSupplier.forEach(o => {
        const total = o.items.reduce((sum, item) => sum + item.total, 0);
        topSellersMap.set(o.supplier.name, (topSellersMap.get(o.supplier.name) || 0) + total);
    });
    const topSellers = Array.from(topSellersMap.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // Top 5


    // 4. Returns by Category (Monthly)
    const monthlyReturnsForCharts = await db.return.findMany({
        where: { date: { gte: startOfMonth(now), lte: endOfMonth(now) } }
    });
    const returnsMap = new Map<string, number>();
    monthlyReturnsForCharts.forEach(r => {
        returnsMap.set(r.categoryName, (returnsMap.get(r.categoryName) || 0) + r.quantity);
    });
    const returnsByCategory = Array.from(returnsMap.entries())
        .map(([name, value]) => ({ name, value }));


    // 5. Orders vs Returns items (Last 7 days)
    const ordersVsReturnsMap = new Map<string, { orders: number, returns: number }>();
    for (let i = 0; i < 7; i++) {
        const d = format(subDays(now, i), 'MMM dd');
        ordersVsReturnsMap.set(d, { orders: 0, returns: 0 });
    }

    last7DaysOrders.forEach(o => {
        const d = format(o.date, 'MMM dd');
        const qty = o.items.reduce((s, i) => s + i.quantity, 0);
        const entry = ordersVsReturnsMap.get(d) || { orders: 0, returns: 0 };
        entry.orders += qty;
        ordersVsReturnsMap.set(d, entry);
    });

    const last7DaysReturns = await db.return.findMany({
        where: { date: { gte: startOfDay(sevenDaysAgo) } }
    });
    last7DaysReturns.forEach(r => {
        const d = format(r.date, 'MMM dd');
        const entry = ordersVsReturnsMap.get(d);
        if (entry) {
            entry.returns += r.quantity;
            ordersVsReturnsMap.set(d, entry);
        }
    });

    const ordersVsReturns = Array.from(ordersVsReturnsMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .reverse();


    return {
        dailyOrders: todayCount,
        dailyRevenue: todayAmount,
        monthlyPieces: monthPieces,
        monthlyPayable: monthAmount,
        topSupplier: topSupplierName,
        chartData: {
            revenueTrend,
            categorySales,
            topSellers,
            returnsByCategory,
            ordersVsReturns
        }
    };
}
