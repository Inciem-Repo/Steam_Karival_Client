import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SpinnerLoader from "../components/ui/SpinnerLoader";
// import { quizCategory } from "../utils/constants/values";

type RouteProps = {
  children: React.ReactNode;
  roles?: string[];
  requiresPayment?: boolean;
};

export const ProtectedRoute = ({ children, roles }: RouteProps) => {
  const { user, isUserLoggedIn, loading } = useAuth();

  if (loading)
    return (
      <div>
        <SpinnerLoader />
      </div>
    );

  if (!isUserLoggedIn) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteProps) => {
  const { user, isUserLoggedIn, loading } = useAuth();

  if (loading)
    return (
      <div>
        <SpinnerLoader />
      </div>
    );

  if (isUserLoggedIn) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
