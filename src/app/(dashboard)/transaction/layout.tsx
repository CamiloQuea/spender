"use client";
import React, { type ReactNode } from "react";
import { routesMap } from "../_navigation/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const baseSettingRoute = routesMap["transaction-page"].path;

const transactionRoutes = [
  { path: baseSettingRoute, name: "Details" },
  { path: baseSettingRoute + "/types", name: "Types" },
  { path: baseSettingRoute + "/options", name: "Options" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div>
      <nav>
        {transactionRoutes.map((route) => (
          <Button
            key={route.path + "-key"}
            variant={"link"}
            className={cn(pathname === route.path && "bg-gray-200")}
          >
            <Link key={route.path} href={route.path}>
              {route.name}
            </Link>
          </Button>
        ))}
      </nav>
      {children}
    </div>
  );
};

export default Layout;
