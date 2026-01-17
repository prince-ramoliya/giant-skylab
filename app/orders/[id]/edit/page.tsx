import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getOrder } from "@/actions/order";
import OrderForm from "@/components/orders/OrderForm";

export default async function EditOrderPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        notFound();
    }

    const suppliers = await db.supplier.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });

    const categories = await db.category.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });

    // Transform order data to match form expectations
    const initialData = {
        id: order.id,
        supplierId: order.supplierId,
        date: order.date, // OrderForm handles Date or string
        notes: order.notes,
        items: order.items.map(item => ({
            categoryName: item.categoryName,
            price: item.price,
            quantity: item.quantity
        }))
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Order</h1>
            </div>
            <OrderForm
                suppliers={suppliers}
                categories={categories}
                initialData={initialData}
                isEditMode={true}
            />
        </div>
    );
}
