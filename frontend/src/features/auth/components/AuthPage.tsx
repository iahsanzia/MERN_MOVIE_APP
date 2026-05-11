import React, { useState } from "react";
import SignupCard from "./SignupCard";
import LoginCard from "./LoginCard";

type AuthMode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  const switchToSignup = () => setMode("signup");
  const switchToLogin = () => setMode("login");

  return (
    <>
      {mode === "login" ? (
        <LoginCard onSwitchToSignup={switchToSignup} />
      ) : (
        <SignupCard onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
}
