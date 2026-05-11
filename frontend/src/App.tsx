import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootAuthPage } from "./features/auth/components/RootAuthPage";
import { PreferencesScreen } from "./features/preferences/components/PreferencesScreen";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {}
          <Route path="/" element={<RootAuthPage />} />

          {}
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <PreferencesScreen />
              </ProtectedRoute>
            }
          />

          {/* Home page - protected */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
