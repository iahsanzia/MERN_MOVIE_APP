import React, { ChangeEvent, FormEvent } from "react";
import { LoginFormData } from "../types/LoginFormData";

interface LoginFormProps {
  formData: LoginFormData;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onSwitchToSignup: () => void;
  loading?: boolean;
  error?: string;
}

function LoginForm({
  formData,
  onChange,
  onSubmit,
  onSwitchToSignup,
  loading = false,
  error,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-3xl font-bold text-white mb-8">Welcome Back</h2>

      {error && (
        <div className="p-4 bg-red text-white rounded text-sm font-semibold">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-white font-semibold text-sm mb-3"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={onChange}
          required
          className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-600 rounded focus:outline-none focus:border-red transition"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-white font-semibold text-sm mb-3"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-600 rounded focus:outline-none focus:border-red transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 py-3 bg-red font-bold text-white text-lg rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging In..." : "Log In"}
      </button>

      <div className="text-center pt-4 border-t border-gray-600">
        <p className="text-gray-300 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-red font-semibold hover:text-red-400 transition"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
