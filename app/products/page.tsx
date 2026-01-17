import { getCategories, createCategory } from "@/actions/category";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, Tag } from "lucide-react";
import { CategoryRow } from "./CategoryRow";

export default async function ProductsPage() {
    const categories = await getCategories();

    async function addCategory(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        if (name && !isNaN(price)) {
            await createCategory({ name, defaultPrice: price });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Categories</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Add Category Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={addCategory} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Name</label>
                                <Input name="name" placeholder="e.g. Hoodie" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Price (₹)</label>
                                <Input name="price" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add Category
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Categories List */}
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white">
                        <CardTitle className="text-lg text-slate-800">All Categories</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Default Price</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((c) => (
                                        <CategoryRow key={c.id} category={c} />
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
