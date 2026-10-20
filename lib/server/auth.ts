import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { practicePasswordEnvName } from "@/lib/access-keys";
import { practiceAccessReference } from "@/lib/academic-practice";
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, adminRequestError, adminToken, hasAdminSession, hasPracticeAccess, practiceCookieName, practiceToken, readAdminPassword, readAuthSecret, readPracticePassword, type AdminCredential, type PracticeCredential } from "@/lib/access";

// The only module that reads password and secret environment variables. Values never leave the
// server: callers get booleans, Set-Cookie values and variable names, never the secrets themselves.

const warned = new Set<string>();
function warnMissing(name: string) {
  if (warned.has(name)) return;
  warned.add(name);
  console.warn(`[access] ${name} is not set${name === "AUTH_SECRET" ? " (or shorter than 32 characters)" : ""}; the pages that need it stay locked.`);
}

function authSecret() {
  const secret = readAuthSecret(process.env);
  if (!secret) warnMissing("AUTH_SECRET");
  return secret;
}

export type PracticeLock = { ok: true; credential: PracticeCredential } | { ok: false };

/** The credential that unlocks an exam, or ok: false when it cannot be opened with the current settings. */
export function practiceLockFor(slug: string[]): PracticeLock {
  const reference = practiceAccessReference(slug);
  if (!reference || reference.error !== undefined) return { ok: false };
  const secret = authSecret();
  const password = readPracticePassword(reference.accessKey, process.env);
  if (!password) warnMissing(practicePasswordEnvName(reference.accessKey));
  if (!secret || !password) return { ok: false };
  return { ok: true, credential: { secret, examPath: `/practice/${slug.join("/")}`, accessKey: reference.accessKey, password } };
}

export async function hasPracticeCookie(credential: PracticeCredential) {
  return hasPracticeAccess(credential, (await cookies()).get(practiceCookieName(credential.examPath))?.value);
}

export const practiceCookieValue = (credential: PracticeCredential) => practiceToken(credential);

// Signing out bumps the epoch so copies of the old cookie stop working. It lives on globalThis so
// every route bundle in the dev server shares it; a restart also starts a new epoch.
const epochStore = globalThis as typeof globalThis & { __hjsAdminEpoch?: string };
const adminEpoch = () => (epochStore.__hjsAdminEpoch ??= randomBytes(16).toString("hex"));
export const endAdminSessions = () => { epochStore.__hjsAdminEpoch = randomBytes(16).toString("hex"); };

function adminCredential(): AdminCredential | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  const secret = authSecret();
  const adminPassword = readAdminPassword(process.env);
  if (!adminPassword) warnMissing("ADMIN_PASSWORD");
  return secret && adminPassword ? { secret, adminPassword, epoch: adminEpoch() } : undefined;
}

/** The admin password to compare against, or a message naming what to configure. Development only. */
export function adminLoginTarget(): { credential: AdminCredential } | { error: string } {
  const credential = adminCredential();
  if (credential) return { credential };
  return { error: ".env.local에 ADMIN_PASSWORD와 32자 이상의 AUTH_SECRET을 설정한 뒤 개발 서버를 다시 시작해 주세요." };
}

export const adminCookieOptions = { httpOnly: true, sameSite: "strict" as const, path: "/", maxAge: ADMIN_COOKIE_MAX_AGE, secure: false };
export const adminCookieValue = (credential: AdminCredential) => adminToken(credential);

/** True only for a signed-in admin on the local development server; always false in production. */
export async function isAdminViewer() {
  const credential = adminCredential();
  return Boolean(credential && hasAdminSession(credential, (await cookies()).get(ADMIN_COOKIE_NAME)?.value));
}

/**
 * Every admin API calls this first. It returns the refusal to send, or undefined to continue.
 * Requests that change files must also come from this site (Origin must match Host).
 */
export async function adminGuard(request: Request, { mutation = request.method !== "GET" } = {}) {
  const refusal = adminRequestError({
    nodeEnv: process.env.NODE_ENV, url: request.url, origin: request.headers.get("origin"), host: request.headers.get("host"),
    mutation, signedIn: await isAdminViewer(),
  });
  return refusal && Response.json({ error: refusal.error }, { status: refusal.status });
}
