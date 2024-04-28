'use client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";
import { Route, routes } from "../_navigation/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SidebarLink = <T extends string>({
  route,
  index: i,
}: {
  route: Route<T> & {
    id: T;
  };
  index: number;
}) => {
  const path = usePathname();

  const isActive = path === route.path;

  return (
    <TooltipProvider key={route.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={route.path}
            className={cn(
              "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base",
              i === 0
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
              i === routes.length - 1 ? "mt-auto" : "",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <route.icon className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">{route.name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side={i === 0 ? "bottom" : "right"}
          align="start"
          className=""
        >
          {route.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarLink;
