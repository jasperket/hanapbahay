import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

const GuestRoute = () => {
  const { user, isRefreshing } = useAuth();
  const location = useLocation();

  if (isRefreshing) {
    return <div>Loading...</div>;
  }

  if (user) {
    const isLandlord = user.roles.some(
      (role) => role.toLowerCase() === "landlord",
    );
    if (isLandlord) {
      return <Navigate to="/properties" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
};

export default GuestRoute;
