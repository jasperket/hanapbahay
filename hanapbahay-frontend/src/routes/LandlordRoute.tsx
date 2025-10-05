import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

const LandlordRoute = () => {
  const { user, isRefreshing } = useAuth();
  const location = useLocation();

  if (isRefreshing) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const isLandlord = user.roles.some(
    (role) => role.toLowerCase() === "landlord",
  );

  if (!isLandlord && location.pathname !== "/") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default LandlordRoute;
