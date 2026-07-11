"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-gray-700/50 text-gray-300 border-gray-600/50",
    success: "bg-green-900/40 text-green-300 border-green-800/50",
    warning: "bg-yellow-900/40 text-yellow-300 border-yellow-800/50",
    danger: "bg-red-900/40 text-red-300 border-red-800/50",
    info: "bg-blue-900/40 text-blue-300 border-blue-800/50",
    purple: "bg-purple-900/40 text-purple-300 border-purple-800/50",
  };

  const dotColors = {
    default: "bg-gray-400",
    success: "bg-green-400",
    warning: "bg-yellow-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    purple: "bg-purple-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
