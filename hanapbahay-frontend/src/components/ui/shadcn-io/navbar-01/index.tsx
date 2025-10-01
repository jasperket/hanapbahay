// components/navbar/Navbar01.tsx
import * as React from "react";
import { HouseHeart } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { AuthDialog } from "./AuthDialog";
import { NavbarContainer } from "./NavbarContainer";

export interface Navbar01NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface Navbar01Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar01NavLink[];
  signInText?: string;
  ctaText?: string;
}

const defaultNavigationLinks: Navbar01NavLink[] = [];

export const Navbar01 = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logo = <HouseHeart />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      ctaText = "Sign Up",
      ...props
    },
    ref,
  ) => {
    const { user, isRefreshing, logout } = useAuth();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loggingOut, setLoggingOut] = React.useState(false);

    const isLandlord =
      user?.roles.some((role) => role.toLowerCase() === "landlord") ?? false;

    const handleLogout = async () => {
      try {
        setLoggingOut(true);
        await logout();
      } finally {
        setLoggingOut(false);
      }
    };

    return (
      <>
        <NavbarContainer
          ref={ref}
          className={className}
          logo={logo}
          logoHref={isLandlord ? "/properties" : logoHref}
          navigationLinks={navigationLinks}
          signInText={signInText}
          ctaText={ctaText}
          user={user}
          isLandlord={isLandlord}
          isRefreshing={isRefreshing}
          isLoggingOut={loggingOut}
          onSignInClick={() => setDialogOpen(true)}
          onLogoutClick={handleLogout}
          {...props}
        />
        <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  },
);

Navbar01.displayName = "Navbar01";
