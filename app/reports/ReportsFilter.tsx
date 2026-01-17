"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/Input";

interface ReportsFilterProps {
    month: Date;
    selectedSupplierId: string;
    suppliers: { id: string; name: string }[];
}

export function ReportsFilter({ month, selectedSupplierId, suppliers }: ReportsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("month", e.target.value);
        router.replace(`?${params.toString()}`);
    };

    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("supplierId", e.target.value);
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex gap-3 items-center">
            <Input
                type="month"
                className="w-auto border-slate-200 shadow-sm focus:ring-indigo-500 rounded-md"
                defaultValue={format(month, "yyyy-MM")}
                onChange={handleMonthChange}
            />
            <div className="relative">
                <select
                    className="h-10 w-48 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-offset-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                    value={selectedSupplierId}
                    onChange={handleSupplierChange}
                >
                    <option value="all">All Sellers</option>
                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
                {/* Chevron Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
