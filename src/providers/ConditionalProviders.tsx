import { lazy, Suspense } from "react";
import type { ReactNode } from "react";

import { useLocation } from "react-router-dom";
import LazyToast from "../components/ui/LazyToast";

const AuthProvider = lazy(() => import("../context/AuthContext"));
const QuizProvider = lazy(() => import("../context/QuizContext"));

interface ConditionalProvidersProps {
  children: ReactNode;
}

export function ConditionalProviders({ children }: ConditionalProvidersProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <Suspense>
      <AuthProvider>
        <QuizProvider>
          <LazyToast />
          {children}
        </QuizProvider>
      </AuthProvider>
    </Suspense>
  );
}
