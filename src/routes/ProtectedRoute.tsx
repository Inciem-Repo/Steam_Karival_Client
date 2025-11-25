import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { quizCategory } from "../utils/constants/values";

type RouteProps = {
  children: React.ReactNode;
  roles?: string[];
  requiresPayment?: boolean;
};

export const ProtectedRoute = ({
  children,
  roles,
  requiresPayment,
}: RouteProps) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  if (
    requiresPayment &&
    user.current_quiz_level !== quizCategory.SCHOOL_LEVEL &&
    !user.isPaid
  ) {
    return <Navigate to="/payment" replace />;
  }
  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteProps) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
