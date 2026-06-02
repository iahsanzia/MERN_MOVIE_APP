import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAppDispatch } from "./store/slices/hooks";
import { verifyToken } from "./store/slices/authSlice";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootAuthPage } from "./features/auth/components/RootAuthPage";
import { PreferencesScreen } from "./features/preferences/components/PreferencesScreen";
import { Home } from "./pages/Home";

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(verifyToken(token));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
