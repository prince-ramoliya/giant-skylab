import Link from "next/link";
import { format } from "date-fns";
import { getOrders } from "@/actions/order";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, ShoppingCart } from "lucide-react";

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No recent orders.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const total = order.items.reduce((sum: number, i: any) => sum + i.total, 0);
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-900 border-r border-slate-50 border-transparent">{format(new Date(order.date), "dd MMM yyyy")}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{order.supplier.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{order.items.length} items</span>
                                                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                                        {order.items.map((i: any) => i.categoryName).join(", ")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                ₹{total.toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
