import { verifyToken } from "../slices/authSlice";

let hasInitialized = false;

export const authInitMiddleware =
  (store: any) => (next: any) => (action: unknown) => {
    if (!hasInitialized) {
      hasInitialized = true;
      const token = localStorage.getItem("authToken");
      if (token) {
        store.dispatch(verifyToken(token) as any);
      }
    }
    return next(action);
  };
