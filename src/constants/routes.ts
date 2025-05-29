export const ROUTES = {
  LOGIN: "/",
  EMPLOYEE: "/employee",
  RETAIL: "/retail",
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = (typeof ROUTES)[RouteKeys];
