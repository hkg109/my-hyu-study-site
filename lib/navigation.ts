// The site's main sections. The desktop header and the mobile drawer both render this list.
export interface PrimaryNavItem { href: string; label: string; icon: "lectures" | "practice" | "review"; matches: string[] }

export const PRIMARY_NAV: PrimaryNavItem[] = [
  { href: "/lectures", label: "강의 정리", icon: "lectures", matches: ["/lectures"] },
  // The unlock page belongs to the practice section.
  { href: "/practice", label: "족보", icon: "practice", matches: ["/practice", "/unlock"] },
  { href: "/review", label: "복습", icon: "review", matches: ["/review"] },
];

export const isNavActive = (pathname: string, item: PrimaryNavItem) =>
  item.matches.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
