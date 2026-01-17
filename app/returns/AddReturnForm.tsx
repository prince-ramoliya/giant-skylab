"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { createReturn } from "@/actions/return";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus } from "lucide-react";

// Schema
const returnSchema = z.object({
    supplierId: z.string().min(1, "Select supplier"),
    categoryName: z.string().min(1, "Select category"),
    price: z.number().min(0),
    quantity: z.number().min(1),
    date: z.string(),
    reason: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface AddReturnFormProps {
    suppliers: { id: string; name: string }[];
    categories: { id: string; name: string; defaultPrice: number }[];
}

export default function AddReturnForm({ suppliers, categories }: AddReturnFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ReturnFormValues>({
        resolver: zodResolver(returnSchema),
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            quantity: 1,
            price: 0,
        },
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catName = e.target.value;
        form.setValue("categoryName", catName);
        const category = categories.find((c) => c.name === catName);
        if (category) {
            form.setValue("price", category.defaultPrice);
        }
    };

    async function onSubmit(data: ReturnFormValues) {
        setIsSubmitting(true);
        try {
            await createReturn({
                ...data,
                date: new Date(data.date),
            });
            form.reset({
                date: format(new Date(), "yyyy-MM-dd"),
                supplierId: "",
                categoryName: "",
                price: 0,
                quantity: 1,
                reason: "",
            });
            router.refresh(); // Refresh data
        } catch (error) {
            alert("Error saving return");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Return Date</label>
                <Input type="date" {...form.register("date")} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <select
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    {...form.register("supplierId")}
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
                {form.formState.errors.supplierId && (
                    <p className="text-xs text-red-500">{form.formState.errors.supplierId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    {...form.register("categoryName")}
                    onChange={handleCategoryChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {form.formState.errors.categoryName && (
                    <p className="text-xs text-red-500">{form.formState.errors.categoryName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Reason (Optional)</label>
                <Input {...form.register("reason")} placeholder="e.g. Defective" />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting} variant="danger">
                <Plus className="mr-2 h-4 w-4" /> Save Return
            </Button>
        </form>
    );
}
