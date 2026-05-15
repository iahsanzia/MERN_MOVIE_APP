import { useState, ChangeEvent, FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";
import { SignupFormData } from "../types/SignupFormData";
import { signupUser } from "../services/authService";
import { useAuth } from "../../../context/AuthContext";

export function useSignupForm(navigate: NavigateFunction) {
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const response = await signupUser(formData);

      const { user, token } = response.data;

      setAuth(user, token);

      console.log("Signup: Navigating to /preferences");
      navigate("/preferences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
}
