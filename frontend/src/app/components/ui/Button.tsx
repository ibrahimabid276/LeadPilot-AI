"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg
      transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-blue-600 text-white
        hover:bg-blue-700
        focus:ring-blue-500
        shadow-sm shadow-blue-500/20
        hover:shadow-md hover:shadow-blue-500/30
      `,
      secondary: `
        bg-gray-700 dark:bg-gray-700 bg-gray-100 text-white dark:text-white text-gray-900
        hover:bg-gray-600 dark:hover:bg-gray-600 hover:bg-gray-200
        focus:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        focus:ring-red-500
        shadow-sm shadow-red-500/20
      `,
      ghost: `
        text-gray-400 dark:text-gray-400 text-gray-600
        hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100
        hover:text-white dark:hover:text-white hover:text-gray-900
        focus:ring-gray-500
      `,
      outline: `
        border border-gray-600 dark:border-gray-600 border-gray-300
        bg-transparent text-gray-300 dark:text-gray-300 text-gray-700
        hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-50
        hover:text-white dark:hover:text-white hover:text-gray-900
        focus:ring-gray-500
      `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 size={size === "sm" ? 12 : size === "lg" ? 18 : 14} className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon}
            {children}
            {iconRight}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
