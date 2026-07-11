"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, trailing, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-lg border px-3 py-2.5 text-sm
              bg-white dark:bg-gray-700/50
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              border-gray-300 dark:border-gray-600
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
              ${icon ? "pl-10" : ""}
              ${trailing ? "pr-10" : ""}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
              ${className}
            `}
            {...props}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {trailing}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
