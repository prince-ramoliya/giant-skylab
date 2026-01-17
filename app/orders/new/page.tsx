import db from "@/lib/db";
import OrderForm from "@/components/orders/OrderForm";

export default async function NewOrderPage() {
    const suppliers = await db.supplier.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });

    const categories = await db.category.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Order</h1>
            </div>
            <OrderForm suppliers={suppliers} categories={categories} />
        </div>
    );
}
