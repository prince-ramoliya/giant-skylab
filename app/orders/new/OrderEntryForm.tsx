"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createOrder } from "@/actions/order";
import { cn } from "@/lib/utils";

// Schema
const orderSchema = z.object({
    supplierId: z.string().min(1, "Please select a seller"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    notes: z.string().optional(),
    items: z.array(
        z.object({
            categoryName: z.string().min(1, "Required"),
            price: z.number().min(0.01, "Min price 0.01"),
            quantity: z.number().min(1, "Min qty 1"),
            total: z.number().optional(), // calculated field for display
        })
    ).min(1, "Add at least one item"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderEntryFormProps {
    suppliers: { id: string; name: string }[];
    categories: { id: string; name: string; defaultPrice: number }[];
}

export default function OrderEntryForm({ suppliers, categories }: OrderEntryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            items: [{ categoryName: "", price: 0, quantity: 1, total: 0 }],
        },
    });

    const { control, register, formState: { errors }, setValue, handleSubmit, watch } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");

    // Calculate live totals for each item and update if needed (visual only)
    // This effect is implicitly handled by render logic or could be a useEffect, 
    // but for simplicity we calculate derived state during render for summary.

    const categoryBreakdown = (watchItems || []).reduce((acc: Record<string, number>, item) => {
        if (item.categoryName && item.quantity > 0) {
            acc[item.categoryName] = (acc[item.categoryName] || 0) + item.quantity;
        }
        return acc;
    }, {});

    const totalAmount = (watchItems || []).reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);

    async function onSubmit(data: OrderFormValues) {
        setIsSubmitting(true);
        try {
            await createOrder({
                supplierId: data.supplierId,
                date: new Date(data.date),
                notes: data.notes,
                items: data.items.map(i => ({ ...i, total: i.price * i.quantity })),
            });
            router.push("/orders");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCategoryChange = (index: number, categoryName: string) => {
        const category = categories.find((c) => c.name === categoryName);
        if (category) {
            setValue(`items.${index}.price`, category.defaultPrice);
        }
        setValue(`items.${index}.categoryName`, categoryName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Form Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <Input type="date" {...register("date")} />
                                    {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Seller</label>
                                    <select
                                        {...register("supplierId")}
                                        className={cn(
                                            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                            errors.supplierId && "border-red-500"
                                        )}
                                    >
                                        <option value="">Select Seller</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.supplierId && (
                                        <p className="text-sm text-red-500">{errors.supplierId.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes (Optional)</label>
                                <Input {...register("notes")} placeholder="e.g. Urgent delivery" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Order Items</CardTitle>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => append({ categoryName: "", price: 0, quantity: 1, total: 0 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {fields.map((field, index) => {
                                    const currentTotal = (watchItems?.[index]?.price || 0) * (watchItems?.[index]?.quantity || 0);
                                    return (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4 last:border-0 last:pb-0">
                                            <div className="col-span-12 md:col-span-4">
                                                <label className="text-xs font-medium mb-1 block">Category</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    {...register(`items.${index}.categoryName`)}
                                                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((c) => (
                                                        <option key={c.id} value={c.name}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="text-xs font-medium mb-1 block">Price</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`items.${index}.price`, { valueAsNumber: true })}
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="text-xs font-medium mb-1 block">Qty</label>
                                                <Input
                                                    type="number"
                                                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                                />
                                            </div>
                                            <div className="col-span-3 md:col-span-3 text-right md:text-left pt-2 md:pt-0 flex flex-col justify-center">
                                                <span className="text-xs text-slate-500 md:hidden block">Total</span>
                                                <span className="text-sm font-medium text-slate-700">
                                                    ₹{currentTotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="col-span-1 md:col-span-1 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="text-lg">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-500">Breakdown</div>
                                {Object.entries(categoryBreakdown).length > 0 ? (
                                    <ul className="text-sm space-y-1">
                                        {Object.entries(categoryBreakdown).map(([cat, qty]) => (
                                            <li key={cat} className="flex justify-between">
                                                <span>{cat}</span>
                                                <span className="font-semibold">{qty} pcs</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No items added</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Grand Total</span>
                                    <span className="text-blue-600 text-2xl">
                                        ₹{totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 text-lg mt-4"
                                variant="primary"
                            >
                                {isSubmitting ? "Saving..." : "Save Order"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
