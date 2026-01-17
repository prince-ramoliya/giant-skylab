import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200": variant === "primary",
                        "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900": variant === "secondary",
                        "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900": variant === "outline",
                        "hover:bg-slate-100 text-slate-700": variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600": variant === "danger",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-10 px-6 py-2": size === "md",
                        "h-11 px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
