import { getCurrentUser } from "@/services/authClient";
import type { AuthLoaderData } from "@/types/auth";

export const rootLoader = async (): Promise<AuthLoaderData> => {
  try {
    const user = await getCurrentUser();
    return { user };
  } catch (error) {
    console.error("Failed to load authentication status", error);
    return { user: null };
  }
};
