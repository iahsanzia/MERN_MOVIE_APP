import { useState, ChangeEvent, FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";
import { LoginFormData } from "../types/LoginFormData";
import { loginUser } from "../services/authService";
import { useAuth } from "../../../context/AuthContext";

export function useLoginForm(navigate: NavigateFunction) {
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
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
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const response = await loginUser(formData.email, formData.password);

      const { user, token } = response.data;

      setAuth(user, token);

      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
}
