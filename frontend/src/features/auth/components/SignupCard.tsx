import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import { useSignupForm } from "../hooks/useSignupForm";

function SignupCard() {
  const navigate = useNavigate();
  const { formData, error, loading, handleChange, handleSubmit } =
    useSignupForm(navigate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red via-black to-gray flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-10 shadow-2xl border border-gray-700">
        <SignupForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default SignupCard;
