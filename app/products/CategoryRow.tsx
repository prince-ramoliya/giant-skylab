"use client";

import { TableCell, TableRow } from "@/components/ui/Table";
import { ActionsMenu } from "@/components/ActionsMenu";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { useState } from "react";
import { deleteCategory } from "@/actions/category";

interface Category {
    id: string;
    name: string;
    defaultPrice: number;
    active: boolean;
}

export function CategoryRow({ category }: { category: Category }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCategory(category.id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to delete category.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium text-slate-900">{category.name}</TableCell>
                <TableCell>₹{category.defaultPrice.toFixed(2)}</TableCell>
                <TableCell>
                    {category.active ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            Inactive
                        </span>
                    )}
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
                title="Delete Category"
                description={`Are you sure you want to delete ${category.name}? This might affect reports if not handled carefully.`}
                isDeleting={isDeleting}
            />
        </>
    );
}
