import { PrismaClient } from "@prisma/client";
import { startOfMonth, subMonths, addDays } from "date-fns";

const prisma = new PrismaClient();

const SUPPLIERS = [
    { name: "Fabrics Inc", gst: "24AAACF1234A1Z5", contact: "9876543210", address: "123 Textile Market, Surat" },
    { name: "Thread Walas", gst: "24BBBCF5678B1Z5", contact: "9123456789", address: "45 Ring Road, Surat" },
    { name: "Gujarat Cotton Co", gst: "24CCCCF9012C1Z5", contact: "9988776655", address: "78 GIDC, Ahmedabad" },
    { name: "Silk Route Traders", gst: "24DDDDF3456D1Z5", contact: "9112233445", address: "12 Silk City, Surat" },
    { name: "Premium Weaves", gst: "24EEEEF7890E1Z5", contact: "9556677889", address: "89 Market Yard, Rajkot" },
];

const CATEGORIES = [
    { name: "Cotton 60s", defaultPrice: 120 },
    { name: "Rayon 14kg", defaultPrice: 85 },
    { name: "Polyester", defaultPrice: 60 },
    { name: "Silk Satin", defaultPrice: 250 },
    { name: "Linen Pure", defaultPrice: 350 },
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Cleanup
    await prisma.orderItem.deleteMany();
    await prisma.return.deleteMany();
    await prisma.order.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.category.deleteMany();

    console.log("🧹 Cleaned database");

    // 2. Create Suppliers
    const suppliers: any[] = [];
    for (const s of SUPPLIERS) {
        const supplier = await prisma.supplier.create({ data: s });
        suppliers.push(supplier);
    }

    // 3. Create Categories
    const categories: any[] = [];
    for (const c of CATEGORIES) {
        const category = await prisma.category.create({ data: c });
        categories.push(category);
    }

    // 4. Generate Data for Last 12 Months
    const today = new Date();

    for (let i = 0; i < 12; i++) {
        const monthDate = subMonths(today, i);
        const start = startOfMonth(monthDate);
        const daysInMonth = 28; // Simplified

        console.log(`📅 Generating data for ${monthDate.toISOString().slice(0, 7)}...`);

        // Generate ~15-20 orders per month
        const orderCount = getRandomInt(15, 20);
        for (let j = 0; j < orderCount; j++) {
            const orderDate = addDays(start, getRandomInt(0, daysInMonth));
            const supplier = getRandomItem(suppliers);

            // 1-3 items per order
            const itemCount = getRandomInt(1, 4);
            const items: any[] = [];

            for (let k = 0; k < itemCount; k++) {
                const category = getRandomItem(categories);
                const quantity = getRandomInt(10, 100);
                const price = category.defaultPrice + getRandomInt(-5, 5); // Slight price variation

                items.push({
                    categoryName: category.name,
                    price: price,
                    quantity: quantity,
                    total: price * quantity
                });
            }

            await prisma.order.create({
                data: {
                    supplierId: supplier.id,
                    date: orderDate,
                    notes: "Auto-generated order",
                    items: {
                        create: items
                    }
                }
            });
        }

        // Generate ~1-3 returns per month
        const returnCount = getRandomInt(1, 3);
        for (let j = 0; j < returnCount; j++) {
            const returnDate = addDays(start, getRandomInt(5, daysInMonth));
            const supplier = getRandomItem(suppliers);
            const category = getRandomItem(categories);
            const quantity = getRandomInt(5, 20);

            await prisma.return.create({
                data: {
                    supplierId: supplier.id,
                    date: returnDate,
                    categoryName: category.name,
                    price: category.defaultPrice,
                    quantity: quantity,
                    reason: "Defective fabric"
                }
            });
        }
    }

    console.log("✅ Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
