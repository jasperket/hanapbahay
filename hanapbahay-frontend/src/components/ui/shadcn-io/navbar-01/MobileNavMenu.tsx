// components/navbar/MobileNavMenu.tsx
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { HamburgerIcon } from "./HamburgerIcon";

export interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export const MobileNavMenu = ({ links }: { links: NavLink[] }) => {
  if (!links.length) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HamburgerIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="flex-col items-start gap-1">
            {links.map((link) => (
              <NavigationMenuItem key={link.href} className="w-full">
                <Link
                  to={link.href}
                  className={cn(
                    "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
      </PopoverContent>
    </Popover>
  );
};
