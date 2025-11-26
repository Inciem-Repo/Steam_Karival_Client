import { lazy } from "react";
import { Route, Outlet } from "react-router-dom";
import type { AppRoute } from ".";

const ProtectedRoute = lazy(() =>
  import("../routes/ProtectedRoute").then((m) => ({
    default: m.ProtectedRoute,
  }))
);

const PublicRoute = lazy(() =>
  import("../routes/ProtectedRoute").then((m) => ({
    default: m.PublicRoute,
  }))
);

export function renderRoute({
  id,
  path,
  layout: Layout,
  children,
  component: Component,
  protected: isProtected,
  roles,
}: AppRoute) {
  const isAuthPage = ["/login", "/register"].includes(path);
  if (children && Layout) {
    return (
      <Route
        key={id}
        path={path}
        element={
          isProtected ? (
            <ProtectedRoute roles={roles}>
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
        {children.map(({ id: childId, path: childPath, component: Child }) =>
          Child ? (
            <Route key={childId} path={childPath} element={<Child />} />
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
            <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
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
