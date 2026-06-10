import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AppRole } from "@/hooks/useAuth";
import PageLoader from "./PageLoader";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: AppRole;
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, loading, roles } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader type="full" message="Loading..." />;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (requireRole && !roles.includes(requireRole)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
