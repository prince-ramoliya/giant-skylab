import { getSuppliers } from "@/actions/supplier";
import { getMonthlyReport } from "@/actions/report";
import { getSettings } from "@/actions/settings";
import { DownloadPDFButton } from "./DownloadPDFButton";
import { ReportsFilter } from "./ReportsFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/Button";
// Link is unused but good to have if we add back button
// import Link from "next/link"; 

export const dynamic = "force-dynamic";

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: { month?: string; supplierId?: string };
}) {
    const suppliers = await getSuppliers();
    const settings = await getSettings();
    const activeSuppliers = suppliers.filter(s => s.active);

    const currentMonth = searchParams.month ? parseISO(searchParams.month + "-01") : new Date();
    // Default to "all" if no supplier is selected
    const selectedSupplierId = searchParams.supplierId || "all";

    const reportData = await getMonthlyReport(currentMonth, selectedSupplierId);

    // unexpected: handle case where ID is not found in list but isn't "all"
    const foundSupplier = suppliers.find((s) => s.id === selectedSupplierId);

    // Construct a supplier object for the UI and PDF
    const displaySupplier = selectedSupplierId === "all"
        ? {
            name: "All Sellers",
            gst: null,
            contact: null,
            address: null,
            id: "all",
            active: true
        }
        : foundSupplier;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monthly Reports</h1>


                // ... inside component ...

                <div className="flex gap-2 items-center">
                    <ReportsFilter
                        month={currentMonth}
                        selectedSupplierId={selectedSupplierId}
                        suppliers={activeSuppliers}
                    />

                    {reportData && displaySupplier && (
                        <DownloadPDFButton
                            data={reportData}
                            month={currentMonth}
                            supplier={{
                                name: displaySupplier.name,
                                gst: displaySupplier.gst,
                                contact: displaySupplier.contact,
                                address: displaySupplier.address,
                            }}
                            settings={{
                                companyName: settings.companyName,
                                companyGst: settings.companyGst,
                                companyAddress: settings.companyAddress,
                            }}
                        />
                    )}
                </div>
            </div>

            {reportData ? (
                <div className="grid gap-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Pieces</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">{reportData.summary.totalPieces}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Gross Amount</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">₹{reportData.summary.grossAmount.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Returns</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-red-600">-₹{reportData.summary.totalReturnsAmount.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-pink-50 border-pink-100">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-pink-600">Net Payable</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-pink-700">₹{reportData.summary.netPayable.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Breakdown Table */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 bg-white">
                            <CardTitle className="text-lg text-slate-800">Category Breakdown</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Quantity</th>
                                        <th className="px-6 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {Object.entries(reportData.categoryBreakdown).length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                No orders this month
                                            </td>
                                        </tr>
                                    ) : (
                                        Object.entries(reportData.categoryBreakdown).map(([name, stats]: [string, any]) => (
                                            <tr key={name} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{name}</td>
                                                <td className="px-6 py-4">₹{stats.price}</td>
                                                <td className="px-6 py-4">{stats.quantity}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                    ₹{stats.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 flex flex-col items-center justify-center text-slate-500">
                        <p>Please select a supplier to view the monthly report.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
