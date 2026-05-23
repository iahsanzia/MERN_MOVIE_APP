export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
}
