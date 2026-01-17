import Link from "next/link";
import { format } from "date-fns";
import { getOrders } from "@/actions/order";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, ShoppingCart } from "lucide-react";
import { OrderRow } from "./OrderRow";

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
                <Link href="/orders/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Order
                    </Button>
                </Link>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-white">
                    <CardTitle className="text-lg text-slate-800">Recent Orders</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Supplier</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3 text-right">Total Amount</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No recent orders.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <OrderRow key={order.id} order={order} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
