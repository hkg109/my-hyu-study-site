import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { practicePasswordEnvName } from "./access-keys";

// Pure helpers for exam and admin authentication. Secrets are always passed in, so this
// module never reads process.env; lib/server/auth.ts is the server-only side that does.

export type Env = Record<string, string | undefined>;

export const PRACTICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;
export const ADMIN_COOKIE_NAME = "hjs-admin";
export const AUTH_SECRET_MIN_LENGTH = 32;
// Bumping the version signs everyone out once, which is what replacing the old unsigned cookies needs.
const TOKEN_VERSION = "v2";

const present = (value: string | undefined) => value && value.trim() ? value : undefined;

export const readAuthSecret = (env: Env) => {
  const secret = present(env.AUTH_SECRET);
  return secret && secret.length >= AUTH_SECRET_MIN_LENGTH ? secret : undefined;
};
export const readAdminPassword = (env: Env) => present(env.ADMIN_PASSWORD);
/** An exam with a key only ever uses that key's variable; it never falls back to the default password. */
export const readPracticePassword = (accessKey: string | undefined, env: Env) => present(env[practicePasswordEnvName(accessKey)]);

const digest = (value: string) => createHash("sha256").update(value).digest();
const sign = (secret: string, parts: string[]) => createHmac("sha256", secret).update(JSON.stringify(parts)).digest("base64url");

function issueToken(secret: string, scope: string[], maxAge: number, now: number) {
  const expires = String(Math.floor(now / 1000) + maxAge);
  return `${TOKEN_VERSION}.${expires}.${sign(secret, [...scope, expires])}`;
}

function verifyToken(secret: string, scope: string[], token: string | undefined, maxAge: number, now: number) {
  const [version, expires, signature, ...rest] = (token ?? "").split(".");
  if (version !== TOKEN_VERSION || rest.length || !signature || !/^\d{1,12}$/.test(expires ?? "")) return false;
  const seconds = Math.floor(now / 1000);
  if (Number(expires) <= seconds || Number(expires) > seconds + maxAge) return false;
  const expected = Buffer.from(sign(secret, [...scope, expires]));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function isPasswordMatch(input: string, expected: string) {
  return timingSafeEqual(digest(input), digest(expected));
}

// Each exam gets its own cookie, so one exam's password never opens another.
export const practiceCookieName = (examPath: string) => `hjs-practice-${digest(examPath).toString("hex").slice(0, 16)}`;

export interface PracticeCredential { secret: string; examPath: string; accessKey?: string; password: string }

// The signature covers the exam path, its accessKey and its current password, so changing
// either the password or the key signs everyone out of that exam without storing the password.
const practiceScope = ({ examPath, accessKey, password }: PracticeCredential) => ["practice", examPath, accessKey ?? "", password];

export const practiceToken = (credential: PracticeCredential, now = Date.now()) => issueToken(credential.secret, practiceScope(credential), PRACTICE_COOKIE_MAX_AGE, now);
export const hasPracticeAccess = (credential: PracticeCredential, token: string | undefined, now = Date.now()) => verifyToken(credential.secret, practiceScope(credential), token, PRACTICE_COOKIE_MAX_AGE, now);

export interface AdminCredential { secret: string; adminPassword: string; epoch: string }

// The epoch changes when an admin signs out (and on every server restart), invalidating copies of the cookie.
const adminScope = ({ adminPassword, epoch }: AdminCredential) => ["admin", adminPassword, epoch];

export const adminToken = (credential: AdminCredential, now = Date.now()) => issueToken(credential.secret, adminScope(credential), ADMIN_COOKIE_MAX_AGE, now);
export const hasAdminSession = (credential: AdminCredential, token: string | undefined, now = Date.now()) => verifyToken(credential.secret, adminScope(credential), token, ADMIN_COOKIE_MAX_AGE, now);

export const isLocalHostname = (hostname: string) => ["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname);

export function isSameOrigin(origin: string | null, host: string | null) {
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export interface AdminRequest { nodeEnv: string | undefined; url: string; origin: string | null; host: string | null; mutation: boolean; signedIn: boolean }

/** Why an admin API request is refused, or undefined when it may proceed. */
export function adminRequestError({ nodeEnv, url, origin, host, mutation, signedIn }: AdminRequest): { status: number; error: string } | undefined {
  if (nodeEnv !== "development") return { status: 404, error: "로컬 개발 환경에서만 사용할 수 있습니다." };
  if (!isLocalHostname(new URL(url).hostname)) return { status: 403, error: "로컬 개발 환경에서만 사용할 수 있습니다." };
  if (mutation && !isSameOrigin(origin, host)) return { status: 403, error: "다른 출처에서 보낸 요청은 처리하지 않습니다." };
  if (!signedIn) return { status: 401, error: "관리자 인증이 필요합니다. 관리자 모드를 다시 시작해 주세요." };
  return undefined;
}

// Only allow redirects back into the practice section after unlocking.
export function safePracticePath(next: string | null | undefined) {
  return next && /^\/practice(?:\/[\w\-/]*)?$/.test(next) ? next : "/practice";
}
