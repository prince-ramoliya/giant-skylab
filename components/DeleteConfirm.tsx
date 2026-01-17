"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isDeleting?: boolean;
}

export function DeleteConfirm({ isOpen, onClose, onConfirm, title, description, isDeleting }: DeleteConfirmProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md scale-100 transform rounded-xl bg-white p-6 shadow-2xl transition-all">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
                    <p className="mb-6 text-sm text-slate-500">{description}</p>

                    <div className="flex w-full justify-end gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isDeleting} className="w-full rounded-md border-slate-200">
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting} className="w-full rounded-md bg-red-600 hover:bg-red-700">
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
