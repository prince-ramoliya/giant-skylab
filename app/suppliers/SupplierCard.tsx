"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BadgeCheck, BadgeAlert, MapPin, Phone, Building } from "lucide-react";
import { ActionsMenu } from "@/components/ActionsMenu";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { useState } from "react";
import { deleteSupplier } from "@/actions/supplier";

interface Supplier {
    id: string;
    name: string;
    contact: string | null;
    address: string | null;
    active: boolean;
    gst: string | null;
}

export function SupplierCard({ supplier }: { supplier: Supplier }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteSupplier(supplier.id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to delete supplier. They may have active orders.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card className="flex flex-col justify-between group hover:border-slate-300">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5">
                    <div className="space-y-1 relative">
                        <CardTitle className="text-base font-bold text-slate-800 line-clamp-1" title={supplier.name}>
                            {supplier.name}
                        </CardTitle>
                        <div className="flex items-center text-xs text-slate-500 font-mono bg-slate-100 rounded px-1.5 py-0.5 w-fit">
                            GST: {supplier.gst || "N/A"}
                        </div>
                    </div>
                    <ActionsMenu
                        onEdit={() => alert("Edit coming next step")}
                        onDelete={() => setIsDeleteOpen(true)}
                    />
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                        <Phone className="mr-2 h-4 w-4 text-slate-400" />
                        {supplier.contact || "N/A"}
                    </div>
                    <div className="flex items-start text-sm text-slate-600">
                        <MapPin className="mr-2 h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2" title={supplier.address || ""}>{supplier.address || "N/A"}</span>
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-slate-50 mt-2">
                        {supplier.active ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                <BadgeCheck className="mr-1 h-3 w-3" /> Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                <BadgeAlert className="mr-1 h-3 w-3" /> Inactive
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Supplier"
                description={`Are you sure you want to delete ${supplier.name}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
}
