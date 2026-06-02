import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/slices/hooks";
import { AuthPage } from "./AuthPage";

export function RootAuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/home", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthPage />;
}
