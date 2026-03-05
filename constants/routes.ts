export const ROUTES = {
  HOME: "Home",
  SCHEDULE: "Schedule",
  COMMUNITY: "Community",
  SEARCH: "Search",
  SETTINGS: "Settings",

  // sub
  POST_DETAIL: "PostDetail",
  SCHEDULING: "Scheduling",
} as const;

export type RouteName = typeof ROUTES[keyof typeof ROUTES];