"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingCart, Users, Package, FileText, Settings, Undo2, ChevronLeft, ChevronRight, Menu } from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Returns", href: "/returns", icon: Undo2 },
    { name: "My Sellers", href: "/suppliers", icon: Users },
    { name: "Products", href: "/products", icon: Package },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 text-white transition-all duration-300 shadow-xl z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center px-4 border-b border-slate-800 justify-between">
                {!isCollapsed && <span className="text-xl font-bold text-white ml-2">SmartBilling</span>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                    {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>
            <nav className="flex-1 space-y-2 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white",
                                    !isCollapsed && "mr-3"
                                )}
                            />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                {!isCollapsed ? (
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-xs font-medium text-slate-500">v1.1.0</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-xs text-slate-500">v1.1</div>
                )}
            </div>
        </div>
    );
}
