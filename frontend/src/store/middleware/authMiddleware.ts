// import { Middleware } from "@reduxjs/toolkit";
import { verifyToken } from "../slices/authSlice";
// import { RootState, AppDispatch } from "../store";

export const authInitMiddleware =
  (store: any) => (next: any) => (action: unknown) => {
    if ((action as any).type === "@@INIT") {
      const token = localStorage.getItem("authToken");
      if (token) {
        store.dispatch(verifyToken(token) as any);
      }
    }
    return next(action);
  };
