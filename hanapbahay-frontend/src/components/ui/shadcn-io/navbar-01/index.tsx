import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { HouseHeart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import type { LoginResponse, LogoutResponse, RegisterResponse, RegisterPayload } from "@/types/auth";

type RoleOption = "Renter" | "Landlord";

interface LoginFormState {
  email: string;
  password: string;
}

interface RegisterFormState {
  displayName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: RoleOption;
}

const roles: RoleOption[] = ["Renter", "Landlord"];

const createInitialLoginState = (): LoginFormState => ({
  email: "",
  password: "",
});

const createInitialRegisterState = (): RegisterFormState => ({
  displayName: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "Renter",
});

const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  );
};

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

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
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

const defaultNavigationLinks: Navbar01NavLink[] = [];

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const payload = error.response?.data as {
      message?: string;
      errors?: string[];
    } | undefined;

    if (payload?.errors?.length) {
      return payload.errors.join(" ");
    }

    if (payload?.message) {
      return payload.message;
    }
  }

  return "Something went wrong. Please try again.";
};

export const Navbar01 = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logo = <HouseHeart />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      ctaText = "Sign Up",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref,
  ) => {
    const { user, login, register, logout, isRefreshing } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [loginForm, setLoginForm] = useState<LoginFormState>(
      createInitialLoginState,
    );
    const [registerForm, setRegisterForm] = useState<RegisterFormState>(
      createInitialRegisterState,
    );
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [loginSubmitting, setLoginSubmitting] = useState(false);
    const [registerSubmitting, setRegisterSubmitting] = useState(false);
    const [logoutSubmitting, setLogoutSubmitting] = useState(false);
    const [pendingLandlordRedirect, setPendingLandlordRedirect] = useState(false);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768);
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref],
    );

    const resetForms = React.useCallback(() => {
      setLoginForm(createInitialLoginState());
      setRegisterForm(createInitialRegisterState());
      setLoginError(null);
      setRegisterError(null);
      setLoginSubmitting(false);
      setRegisterSubmitting(false);
    }, []);

    const handleDialogOpenChange = (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setActiveTab("login");
        resetForms();
      }
    };

    const handleSignIn = () => {
      onSignInClick?.();
      setActiveTab("login");
      setDialogOpen(true);
    };

    const handleSignUp = () => {
      onCtaClick?.();
      setActiveTab("register");
      setDialogOpen(true);
    };

    const handleLoginSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      setLoginSubmitting(true);
      setLoginError(null);
      setPendingLandlordRedirect(false);

      try {
        const response: LoginResponse = await login(loginForm);
        toast.success(response.message ?? "Logged in successfully.");
        resetForms();
        setDialogOpen(false);

        const normalizedRole = response.role?.toLowerCase();
        if (normalizedRole === "landlord") {
          navigate("/properties");
          setPendingLandlordRedirect(false);
        } else {
          setPendingLandlordRedirect(true);
        }
      } catch (error) {
        const message = getErrorMessage(error);
        setLoginError(message);
        toast.error(message);
        setPendingLandlordRedirect(false);
      } finally {
        setLoginSubmitting(false);
      }
    };

    const handleRegisterSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      setRegisterSubmitting(true);
      setRegisterError(null);

      try {
        const roleValue: RegisterPayload["role"] =
          registerForm.role === "Landlord" ? 1 : 0;

        const payload: RegisterPayload = {
          displayName: registerForm.displayName,
          email: registerForm.email,
          password: registerForm.password,
          phoneNumber: registerForm.phoneNumber,
          role: roleValue,
        };

        const response: RegisterResponse = await register(payload);
        toast.success(
          response.message ?? "Registration successful. You may log in now.",
        );
        setActiveTab("login");
        setRegisterForm(createInitialRegisterState());
      } catch (error) {
        const message = getErrorMessage(error);
        setRegisterError(message);
        toast.error(message);
      } finally {
        setRegisterSubmitting(false);
      }
    };

    const handleLogout = async () => {
      setLogoutSubmitting(true);
      try {
        const response: LogoutResponse = await logout();
        toast.success(response.message ?? "Logged out successfully.");
        setPendingLandlordRedirect(false);
        navigate("/");
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
      } finally {
        setLogoutSubmitting(false);
      }
    };

    const isLandlord = useMemo(
      () => user?.roles.some((role) => role.toLowerCase() === "landlord") ?? false,
      [user],
    );

    useEffect(() => {
      if (!pendingLandlordRedirect) {
        return;
      }

      if (!user) {
        return;
      }

      if (isLandlord) {
        navigate("/properties");
      }

      setPendingLandlordRedirect(false);
    }, [isLandlord, navigate, pendingLandlordRedirect, user]);

    const computedLinks = useMemo(() => {
      const links = [...navigationLinks];

      if (isLandlord && !links.some((link) => link.href === "/properties")) {
        links.unshift({ href: "/properties", label: "Properties" });
      }

      return links;
    }, [isLandlord, navigationLinks]);

    const navItems = useMemo(
      () =>
        computedLinks.map((link) => ({
          ...link,
          active:
            link.active
              ?? (link.href.startsWith("/")
                && (location.pathname === link.href
                  || (link.href !== "/" && location.pathname.startsWith(`${link.href}/`)))),
        })),
      [computedLinks, location.pathname],
    );

    return (
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <header
          ref={combinedRef}
          className={cn(
            "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur md:px-6 [&_*]:no-underline",
            className,
          )}
          {...props}
        >
          <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isMobile && navItems.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="group hover:bg-accent hover:text-accent-foreground h-9 w-9"
                      variant="ghost"
                      size="icon"
                    >
                      <HamburgerIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-48 p-2">
                    <NavigationMenu className="max-w-none">
                      <NavigationMenuList className="flex-col items-start gap-1">
                        {navItems.map((link) => (
                          <NavigationMenuItem key={link.href} className="w-full">
                            <Link
                              to={link.href}
                              className={cn(
                                "hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                link.active
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground/80",
                              )}
                            >
                              {link.label}
                            </Link>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </PopoverContent>
                </Popover>
              )}
              <Link
                to={isLandlord ? "/properties" : logoHref}
                className="text-primary hover:text-primary/90 flex items-center space-x-2 transition-colors"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden text-xl font-bold sm:inline-block">
                  Rentahan
                </span>
              </Link>
              {!isMobile && navItems.length > 0 && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navItems.map((link) => (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          to={link.href}
                          className={cn(
                            "group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none",
                            link.active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/80 hover:text-foreground",
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isLandlord && (
                    <Button
                      asChild
                      size="sm"
                      className="h-9 rounded-md px-4 text-sm font-medium shadow-sm"
                    >
                      <Link to="/properties/new">Add property</Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="h-9 rounded-md px-4 text-sm font-medium shadow-sm"
                    variant="outline"
                    onClick={handleLogout}
                    disabled={logoutSubmitting || isRefreshing}
                  >
                    {logoutSubmitting || isRefreshing ? (
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
                  <Button
                    size="sm"
                    className="h-9 rounded-md px-4 text-sm font-medium shadow-sm"
                    type="button"
                    onClick={handleSignIn}
                  >
                    {signInText}
                  </Button>
                  <Button
                    size="sm"
                    className="hover:bg-accent hover:text-accent-foreground text-sm font-medium"
                    variant="ghost"
                    type="button"
                    onClick={handleSignUp}
                  >
                    {ctaText}
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {activeTab === "login" ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "login"
                ? "Log in to manage your properties and preferences."
                : "Register to start listing properties or find your next home."}
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="mt-2"
          >
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                  />
                </div>
                {loginError && (
                  <p className="text-destructive text-sm">{loginError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginSubmitting || isRefreshing}
                >
                  {loginSubmitting || isRefreshing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Signing in
                    </span>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full name</label>
                  <Input
                    type="text"
                    autoComplete="name"
                    required
                    value={registerForm.displayName}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        displayName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone number</label>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    required
                    value={registerForm.phoneNumber}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        phoneNumber: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Account type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={registerForm.role}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        role: event.target.value as RoleOption,
                      }))
                    }
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                {registerError && (
                  <p className="text-destructive text-sm">{registerError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerSubmitting}
                >
                  {registerSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Creating account
                    </span>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  },
);

Navbar01.displayName = "Navbar01";

export { Logo, HamburgerIcon };




