import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { AuthPage } from "./AuthPage";

export function RootAuthPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Only redirect once on component mount if already authenticated
  // This prevents interfering with navigate("/preferences") during signup
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, []); // Empty dependency array - runs only once on mount

  // If not authenticated, show login/signup page
  return <AuthPage />;
}
