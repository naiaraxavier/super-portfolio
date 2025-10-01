"use client";

import toast from "react-hot-toast";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      const message = description || title || "";

      if (variant === "destructive") {
        toast.error(message);
      } else {
        toast.success(message);
      }
    },
  };
}
