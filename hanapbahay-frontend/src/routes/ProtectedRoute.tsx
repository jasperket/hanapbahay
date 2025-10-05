import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

const ProtectedRoute = () => {
  const { user, isRefreshing } = useAuth();
  const location = useLocation();

  if (isRefreshing) {
    return <div>Loading...</div>; // or spinner
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
