"use client";

import { TableCell, TableRow } from "@/components/ui/Table";
import { ActionsMenu } from "@/components/ActionsMenu";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { useState } from "react";
import { deleteOrder } from "@/actions/order";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface OrderItem {
    id: string;
    categoryName: string;
    price: number;
    quantity: number;
    total: number;
}

interface Order {
    id: string;
    date: Date;
    supplier: { name: string };
    items: OrderItem[];
    notes: string | null;
}

export function OrderRow({ order }: { order: Order }) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteOrder(order.id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to delete order.");
        } finally {
            setIsDeleting(false);
        }
    };

    const total = order.items.reduce((sum, i) => sum + i.total, 0);

    return (
        <>
            <TableRow>
                <TableCell className="px-6 py-4 whitespace-nowrap text-slate-900 border-r border-slate-50 border-transparent">
                    {format(new Date(order.date), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-slate-900">
                    {order.supplier.name}
                </TableCell>
                <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{order.items.length} items</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                            {order.items.map((i) => i.categoryName).join(", ")}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-bold text-slate-900">
                    ₹{total.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                    <ActionsMenu
                        onEdit={() => router.push(`/orders/${order.id}/edit`)}
                        onDelete={() => setIsDeleteOpen(true)}
                    />
                </TableCell>
            </TableRow>

            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Order"
                description="Are you sure you want to delete this order? This cannot be undone."
                isDeleting={isDeleting}
            />
        </>
    );
}
