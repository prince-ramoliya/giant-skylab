import { getReturns } from "@/actions/return";
import db from "@/lib/db";
import AddReturnForm from "./AddReturnForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { format } from "date-fns";

export default async function ReturnsPage() {
    const returns = await getReturns();
    const suppliers = await db.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" } });
    const categories = await db.category.findMany({ where: { active: true }, orderBy: { name: "asc" } });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Returns</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Log New Return</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AddReturnForm suppliers={suppliers} categories={categories} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white">
                        <CardTitle className="text-lg text-slate-800">Return History</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Supplier</th>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3 text-right">Refund Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {returns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No returns logged.
                                        </td>
                                    </tr>
                                ) : (
                                    returns.map((r: any) => (
                                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-900">{format(new Date(r.date), "dd MMM yyyy")}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{r.supplier.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{r.quantity} x {r.categoryName}</span>
                                                    <span className="text-xs text-slate-500">@ ₹{r.price}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-[150px] truncate" title={r.reason || ""}>{r.reason || "-"}</td>
                                            <td className="px-6 py-4 text-right font-bold text-red-600">
                                                -₹{(r.price * r.quantity).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
