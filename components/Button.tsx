/**
 * Follicia — Reusable Button Component
 * Wraps brand styling with accessible HTML button semantics.
 */
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-[0.9375rem]",
    lg: "px-8 py-3.5 text-base",
};

const variantClasses = {
    primary: "btn-brand",
    secondary:
        "bg-transparent border border-[#E8C5B0] text-[#2C2C2C] rounded-full font-semibold hover:bg-[#F5EFE7] transition-all duration-300",
    ghost:
        "bg-transparent text-[#8A8A8A] hover:text-[#B5604B] font-medium transition-colors duration-200",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
