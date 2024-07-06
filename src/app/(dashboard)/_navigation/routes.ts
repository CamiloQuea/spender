import { BookText, LineChart, LucideProps, Package2, Settings2, ShoppingCart, Users2 } from "lucide-react";
import React from "react";

export type IconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>

export type Route<T extends string> = {
  path: `/${T | ""}`;
  name: `${string}`;
  icon: IconType
};

export type RouteMap<T extends string> = {
  [k in `${T}-page`]: Route<T>;
};

export type RouteKey =
  | "main"
  | "summary"
  | "transaction"
  | "loans"
  | "graph"
  | "settings";

export const routesMap: RouteMap<RouteKey> = {
  "main-page": {
    path: "/",
    name: "Dashboard",
    icon: Package2
  },
  "summary-page": {
    path: "/summary",
    name: "Summary",
    icon: BookText
  },
  "transaction-page": {
    path: "/transaction",
    name: "Transactions",
    icon: ShoppingCart
  },
  "loans-page": {
    path: "/loans",
    name: "Loans",
    icon: Users2
  },
  "graph-page": {
    path: "/graph",
    name: "Graphs",
    icon: LineChart
  },
  "settings-page": {
    path: "/settings",
    name: "Settings",
    icon: Settings2
  },
};

// get an array with id, path and name
export const routes = Object.entries(routesMap).map(([id, route]) => ({
  id: id as RouteKey,
  ...route,
}));
