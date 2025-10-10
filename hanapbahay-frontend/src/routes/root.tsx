import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
};

export default RootLayout;
