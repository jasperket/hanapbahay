import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { getCurrentUser } from "@/services/authClient";
import type { AuthLoaderData } from "@/types/auth";

export const loader = async (): Promise<AuthLoaderData> => {
  try {
    const user = await getCurrentUser();
    return { user };
  } catch (error) {
    console.error("Failed to load authentication status", error);
    return { user: null };
  }
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
};

export default RootLayout;
