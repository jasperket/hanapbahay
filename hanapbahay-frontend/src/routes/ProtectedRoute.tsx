import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
