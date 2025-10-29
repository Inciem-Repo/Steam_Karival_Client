import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { routes } from "./routes";
import { QuizProvider } from "./context/QuizContext";

function AppRoutes() {
  return (
    <Routes>
      {routes.map(
        ({ id, path, component: Component, protected: isProtected, roles }) => {
          if (isProtected) {
            return (
              <Route
                key={id}
                path={path}
                element={
                  <ProtectedRoute roles={roles}>
                    <Component />
                  </ProtectedRoute>
                }
              />
            );
          }
          return <Route key={id} path={path} element={<Component />} />;
        }
      )}
    </Routes>
  );
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AuthProvider>
        <QuizProvider>
          <Router>
            <AppRoutes />
          </Router>
        </QuizProvider>
      </AuthProvider>
    </>
  );
}

export default App;
