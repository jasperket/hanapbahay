// components/navbar/NavbarContainer.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { MobileNavMenu } from "./MobileNavMenu";
import { DesktopNavMenu } from "./DesktopNavMenu";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import type { AuthUser } from "@/types/auth";

interface NavbarContainerProps extends React.HTMLAttributes<HTMLElement> {
  logo: React.ReactNode;
  logoHref: string;
  navigationLinks: { href: string; label: string; active?: boolean }[];
  signInText: string;
  ctaText: string;
  user: AuthUser | null;
  isLandlord: boolean;
  isRefreshing: boolean;
  isLoggingOut: boolean;
  onSignInClick: () => void;
  onLogoutClick: () => void;
}

export const NavbarContainer = React.forwardRef<
  HTMLElement,
  NavbarContainerProps
>(
  (
    {
      className,
      logo,
      logoHref,
      navigationLinks,
      signInText,
      ctaText,
      user,
      isLandlord,
      isRefreshing,
      isLoggingOut,
      onSignInClick,
      onLogoutClick,
      ...props
    },
    ref,
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          "bg-background/90 sticky top-0 z-50 border-b px-4",
          className,
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {navigationLinks.length > 0 && (
              <MobileNavMenu links={navigationLinks} />
            )}
            <Link
              to={isLandlord ? "/properties" : logoHref}
              className="text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <div className="text-2xl">{logo}</div>
              <span className="hidden text-xl font-bold sm:inline-block">
                Rentahan
              </span>
            </Link>
            {navigationLinks.length > 0 && (
              <DesktopNavMenu links={navigationLinks} />
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {isLandlord && (
                  <Button asChild size="sm">
                    <Link to="/properties/new">Add property</Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isRefreshing || isLoggingOut}
                  onClick={onLogoutClick}
                >
                  {isRefreshing || isLoggingOut ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Logging out
                    </span>
                  ) : (
                    "Log Out"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={onSignInClick}>
                  {signInText}
                </Button>
                <Button size="sm" variant="ghost" onClick={onSignInClick}>
                  {ctaText}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  },
);

NavbarContainer.displayName = "NavbarContainer";
