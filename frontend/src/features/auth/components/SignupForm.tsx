import React, { ChangeEvent, FormEvent } from "react";
import { SignupFormData } from "../types/SignupFormData";

interface SignupFormProps {
  formData: SignupFormData;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string;
}

function SignupForm({
  formData,
  onChange,
  onSubmit,
  loading = false,
  error,
}: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-3xl font-bold text-white mb-8">Create Account</h2>

      {error && (
        <div className="p-4 bg-red text-white rounded text-sm font-semibold">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-white font-semibold text-sm mb-3"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={onChange}
          required
          className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-600 rounded focus:outline-none focus:border-red transition"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-white font-semibold text-sm mb-3"
        >
          Email Address
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
          Password (min 8 characters)
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter a strong password"
          value={formData.password}
          onChange={onChange}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-600 rounded focus:outline-none focus:border-red transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 py-3 bg-red font-bold text-white text-lg rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignupForm;
