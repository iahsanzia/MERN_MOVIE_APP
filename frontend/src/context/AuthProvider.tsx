import React, { useEffect, useState } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);

      verifyTokenWithBackend(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyTokenWithBackend = async (authToken: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/verify`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.data?.user || null);
      } else {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAuth = (newUser: User, authToken: string) => {
    setUser(newUser);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const getToken = () => {
    return token || localStorage.getItem("authToken");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    setAuth: handleSetAuth,
    logout: handleLogout,
    getToken,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
