// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { AuthProvider } from "./context/AuthProvider";
// import { MoviesProvider } from "./context/MoviesProvider";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import { RootAuthPage } from "./features/auth/components/RootAuthPage";
// import { PreferencesScreen } from "./features/preferences/components/PreferencesScreen";
// import { Home } from "./pages/Home";
// // import {Provider} from "react-redux";
// // import {store} from "./store/store";

// function App() {
//   return (
//     <BrowserRouter>
//       {/* <Provider store={store}> */}
//       <AuthProvider>
//         <MoviesProvider>
//           <Routes>
//             <Route path="/" element={<RootAuthPage />} />

//             <Route
//               path="/preferences"
//               element={
//                 <ProtectedRoute>
//                   <PreferencesScreen />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/home"
//               element={
//                 <ProtectedRoute>
//                   <Home />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={true}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="dark"
//           />
//         </MoviesProvider>
//       </AuthProvider>
//       {/* </Provider> */}
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "./store/slices/authSlice";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootAuthPage } from "./features/auth/components/RootAuthPage";
import { PreferencesScreen } from "./features/preferences/components/PreferencesScreen";
import { Home } from "./pages/Home";
import { AuthProvider } from "./context/AuthProvider";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(verifyToken(token) as any);
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
