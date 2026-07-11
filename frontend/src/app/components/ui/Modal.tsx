"use client";

import { ReactNode, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  footer,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onOpenChange]);

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
        
        {/* Modal content */}
        <Dialog.Content
          className={`
            fixed left-1/2 top-1/2 z-50 w-full ${sizes[size]}
            -translate-x-1/2 -translate-y-1/2
            rounded-xl border border-gray-700 dark:border-gray-700 border-gray-200
            bg-white dark:bg-gray-800
            shadow-2xl shadow-black/50
            animate-in fade-in zoom-in-95 duration-200
            focus:outline-none
          `}
        >
          {/* Header */}
          {(title || description) && (
            <div className="border-b border-gray-700 dark:border-gray-700 border-gray-200 px-6 py-4">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-white dark:text-white text-gray-900">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </Dialog.Close>

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-700 dark:border-gray-700 border-gray-200 px-6 py-4 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Confirmation dialog
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-lg
              disabled:opacity-50 transition-colors
              ${variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">{description}</p>
    </Modal>
  );
}
