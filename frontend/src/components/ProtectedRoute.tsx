import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/slices/hooks";
import { ProtectedRouteProps } from "./types/protected-route";

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
