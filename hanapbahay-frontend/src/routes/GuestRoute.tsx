import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

const GuestRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const isLandlord = user.roles.some(
      (role) => role.toLowerCase() === "landlord",
    );
    if (isLandlord) {
      return <Navigate to="/properties" replace state={{ from: location }} />;
    }
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default GuestRoute;
