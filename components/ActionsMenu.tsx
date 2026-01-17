"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
}

export function ActionsMenu({ onEdit, onDelete, isDeleting }: ActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={wrapperRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
                disabled={isDeleting}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-1 w-36 origin-top-right rounded-md border border-slate-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onEdit();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onDelete();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
