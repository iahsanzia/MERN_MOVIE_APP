import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthProvider";
import { MoviesProvider } from "./context/MoviesProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootAuthPage } from "./features/auth/components/RootAuthPage";
import { PreferencesScreen } from "./features/preferences/components/PreferencesScreen";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoviesProvider>
          <Routes>
            <Route path="/" element={<RootAuthPage />} />

            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <PreferencesScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </MoviesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
