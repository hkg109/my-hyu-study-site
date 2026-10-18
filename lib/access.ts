import { createHash, timingSafeEqual } from "node:crypto";
import access from "../config/access.json";

// Passwords live in config/access.json so they can be changed in one place.
type AccessConfig = { practicePassword: string; adminPassword: string };

function readAccessConfig(value: unknown): AccessConfig {
  const config = value as Partial<AccessConfig>;
  for (const key of ["practicePassword", "adminPassword"] as const) {
    if (typeof config[key] !== "string" || !config[key].trim()) throw new Error(`config/access.json: "${key}" must be a non-empty string`);
  }
  return config as AccessConfig;
}

const config = readAccessConfig(access);

export const PRACTICE_COOKIE = "hjs-practice-access";
export const PRACTICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const digest = (value: string) => createHash("sha256").update(value).digest();

// The cookie stores a hash of the password, so changing the password signs everyone out.
export const practiceToken = () => digest(`hjs-practice:${config.practicePassword}`).toString("hex");

export function hasPracticeAccess(cookieValue: string | undefined) {
  if (!cookieValue) return false;
  return timingSafeEqual(digest(cookieValue), digest(practiceToken()));
}

export function isPracticePassword(input: string) {
  return timingSafeEqual(digest(input), digest(config.practicePassword));
}

export const adminPassword = () => config.adminPassword;

// Only allow redirects back into the practice section after unlocking.
export function safePracticePath(next: string | null | undefined) {
  return next && /^\/practice(?:\/[\w\-/]*)?$/.test(next) ? next : "/practice";
}
