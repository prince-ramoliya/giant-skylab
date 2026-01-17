"use client";

import { TableCell, TableRow } from "@/components/ui/Table";
import { ActionsMenu } from "@/components/ActionsMenu";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { useState } from "react";
import { deleteReturn } from "@/actions/return";
import { format } from "date-fns";

interface Return {
    id: string;
    date: Date;
    supplier: { name: string };
    categoryName: string;
    quantity: number;
    price: number;
    reason: string | null;
}

export function ReturnRow({ returnItem }: { returnItem: Return }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteReturn(returnItem.id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to delete return.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium text-slate-900">
                    {format(new Date(returnItem.date), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{returnItem.supplier.name}</TableCell>
                <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10">
                        {returnItem.categoryName}
                    </span>
                </TableCell>
                <TableCell className="font-mono text-xs">{returnItem.quantity}</TableCell>
                <TableCell className="font-mono text-xs">₹{returnItem.price}</TableCell>
                <TableCell className="font-mono font-medium text-slate-900">
                    ₹{(returnItem.quantity * returnItem.price).toFixed(2)}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-slate-500" title={returnItem.reason || ""}>
                    {returnItem.reason || "-"}
                </TableCell>
                <TableCell className="text-right">
                    <ActionsMenu
                        onEdit={() => alert("Edit coming next step")}
                        onDelete={() => setIsDeleteOpen(true)}
                    />
                </TableCell>
            </TableRow>

            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Return"
                description="Are you sure you want to delete this return entry?"
                isDeleting={isDeleting}
            />
        </>
    );
}
