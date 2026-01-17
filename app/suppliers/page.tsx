import { getSuppliers, createSupplier } from "@/actions/supplier";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus } from "lucide-react";
import { SupplierCard } from "./SupplierCard";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();

    async function addSupplier(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const gst = formData.get("gst") as string;
        const contact = formData.get("contact") as string;
        const address = formData.get("address") as string;
        if (name) {
            await createSupplier({ name, gst, contact, address });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Sellers</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Add Seller Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Seller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={addSupplier} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Seller Name</label>
                                <Input name="name" placeholder="Enter name" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GST Number (Optional)</label>
                                <Input name="gst" placeholder="GST number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact (Optional)</label>
                                <Input name="contact" placeholder="Phone number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Address (Optional)</label>
                                <Input name="address" placeholder="e.g. 123 Textile Market, Surat" />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add Seller
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {suppliers.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="py-12 flex flex-col items-center justify-center text-slate-500">
                                <p>No suppliers found. Add one to get started.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        suppliers.map((supplier) => (
                            <SupplierCard key={supplier.id} supplier={supplier} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
