import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import { routes } from "./routes";
import { QuizProvider } from "./context/QuizContext";

function AppRoutes() {
  return (
    <Routes>
      {routes.map(
        ({
          id,
          path,
          layout: Layout,
          children,
          component: Component,
          protected: isProtected,
          roles,
          requiresPayment,
        }) => {
          const isAuthPage = ["/login", "/register","/"].includes(path);

          if (children && Layout) {
            return (
              <Route
                key={id}
                path={path}
                element={
                  isProtected ? (
                    <ProtectedRoute
                      roles={roles}
                      requiresPayment={requiresPayment}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </ProtectedRoute>
                  ) : isAuthPage ? (
                    <PublicRoute>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </PublicRoute>
                  ) : (
                    <Layout>
                      <Outlet />
                    </Layout>
                  )
                }
              >
                {children.map(
                  ({ id: childId, path: childPath, component: Child }) =>
                    Child ? (
                      <Route
                        key={childId}
                        path={childPath}
                        element={<Child />}
                      />
                    ) : null
                )}
              </Route>
            );
          }

          if (Component) {
            const element = Layout ? (
              <Layout>
                <Component />
              </Layout>
            ) : (
              <Component />
            );

            return (
              <Route
                key={id}
                path={path}
                element={
                  isProtected ? (
                    <ProtectedRoute
                      roles={roles}
                      requiresPayment={requiresPayment}
                    >
                      {element}
                    </ProtectedRoute>
                  ) : isAuthPage ? (
                    <PublicRoute>{element}</PublicRoute>
                  ) : (
                    element
                  )
                }
              />
            );
          }

          return null;
        }
      )}
    </Routes>
  );
}

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
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
