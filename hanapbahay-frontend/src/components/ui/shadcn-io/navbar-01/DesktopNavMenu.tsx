// components/navbar/DesktopNavMenu.tsx
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export const DesktopNavMenu = ({ links }: { links: NavLink[] }) => {
  if (!links.length) return null;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <Link
              to={link.href}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                link.active
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {link.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
