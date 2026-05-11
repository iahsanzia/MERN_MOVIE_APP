import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useLoginForm } from "../hooks/useLoginForm";

interface LoginCardProps {
  onSwitchToSignup: () => void;
}

function LoginCard({ onSwitchToSignup }: LoginCardProps) {
  const navigate = useNavigate();
  const { formData, error, loading, handleChange, handleSubmit } =
    useLoginForm(navigate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red via-black to-gray flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-10 shadow-2xl border border-gray-700">
        <LoginForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onSwitchToSignup={onSwitchToSignup}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default LoginCard;
