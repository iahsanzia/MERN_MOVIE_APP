import { toast } from "react-toastify";
import { ToastType } from "../services/types/toast";

interface ToastOptions {
  duration?: number;
}

export const showToast = (
  message: string,
  type: ToastType = "info",
  options: ToastOptions = {},
) => {
  const { duration = 3000 } = options;

  toast[type](message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Re-export types for backward compatibility
export type { ToastType } from "../services/types/toast";
