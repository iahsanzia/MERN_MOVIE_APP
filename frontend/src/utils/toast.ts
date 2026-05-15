import { toast } from "react-toastify";

export type ToastType = "success" | "error" | "info";

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
