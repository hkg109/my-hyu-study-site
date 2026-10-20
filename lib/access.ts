import { createHash, timingSafeEqual } from "node:crypto";
import access from "../config/access.json";

// Shared passwords live in config/access.json. An exam can override practicePassword
// with its own `password` front matter field (see lib/academic-practice.ts).
type AccessConfig = { practicePassword: string; adminPassword: string };

function readAccessConfig(value: unknown): AccessConfig {
  const config = value as Partial<AccessConfig>;
  for (const key of ["practicePassword", "adminPassword"] as const) {
    if (typeof config[key] !== "string" || !config[key].trim()) throw new Error(`config/access.json: "${key}" must be a non-empty string`);
  }
  return config as AccessConfig;
}

const config = readAccessConfig(access);

export const PRACTICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const digest = (value: string) => createHash("sha256").update(value).digest();

export const defaultPracticePassword = () => config.practicePassword;

// Each exam gets its own cookie, so one exam's password never opens another.
export const practiceCookieName = (examPath: string) => `hjs-practice-${digest(examPath).toString("hex").slice(0, 16)}`;

// The cookie stores a hash of the exam path and password, so changing a password signs everyone out of that exam.
export const practiceToken = (examPath: string, password: string) => digest(`hjs-practice:${examPath}:${password}`).toString("hex");

export function hasPracticeAccess(examPath: string, password: string, cookieValue: string | undefined) {
  if (!cookieValue) return false;
  return timingSafeEqual(digest(cookieValue), digest(practiceToken(examPath, password)));
}

export function isPracticePassword(input: string, password: string) {
  return timingSafeEqual(digest(input), digest(password));
}

export const adminPassword = () => config.adminPassword;

// Only allow redirects back into the practice section after unlocking.
export function safePracticePath(next: string | null | undefined) {
  return next && /^\/practice(?:\/[\w\-/]*)?$/.test(next) ? next : "/practice";
}
