import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { practicePasswordEnvName } from "@/lib/access-keys";
import { practiceAccessReference } from "@/lib/academic-practice";
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, adminRequestError, adminToken, hasAdminSession, hasPracticeAccess, isPasswordMatch, practiceCookieName, practiceToken, readAdminPassword, readAuthSecret, readPracticePassword, type AdminCredential, type PracticeCredential } from "@/lib/access";
import { contentFromDb } from "@/lib/content-source";

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

const development = () => process.env.NODE_ENV === "development";

/** The deployed site runs admin mode only with DB content (files can't be written there) and a long admin password. */
export const ADMIN_PASSWORD_MIN_LENGTH = 12;
function remoteAdminAllowed() {
  const password = readAdminPassword(process.env);
  return !development() && contentFromDb() && Boolean(password && password.length >= ADMIN_PASSWORD_MIN_LENGTH && readAuthSecret(process.env));
}

/** Whether this server offers admin mode at all (the local dev server, or a configured deployment). */
export const adminAvailable = () => development() || remoteAdminAllowed();

// ---------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------

/**
 * ok: the credential that signs this exam's cookie. In DB mode `password` holds the stored hash, so
 * changing the password still signs everyone out of the exam; the plain password is never read.
 */
export type PracticeLock = { ok: true; credential: PracticeCredential; documentId?: string } | { ok: false };

/** The credential that unlocks an exam, or ok: false when it cannot be opened with the current settings. */
export async function practiceLockFor(slug: string[]): Promise<PracticeLock> {
  const secret = authSecret();
  const examPath = `/practice/${slug.join("/")}`;
  if (contentFromDb()) {
    const { dbPracticeLock } = await import("./content-admin");
    const lock = await dbPracticeLock(slug);
    if (!secret || !lock) return { ok: false };
    return { ok: true, documentId: lock.documentId, credential: { secret, examPath, accessKey: lock.accessKey, password: lock.passwordHash } };
  }
  const reference = practiceAccessReference(slug);
  if (!reference || reference.error !== undefined) return { ok: false };
  const password = readPracticePassword(reference.accessKey, process.env);
  if (!password) warnMissing(practicePasswordEnvName(reference.accessKey));
  if (!secret || !password) return { ok: false };
  return { ok: true, credential: { secret, examPath, accessKey: reference.accessKey, password } };
}

/** Whether a typed password opens the exam. DB mode asks the database to compare against the hash. */
export async function isPracticePassword(lock: Extract<PracticeLock, { ok: true }>, input: string) {
  if (lock.documentId) {
    const { dbVerifyPracticePassword } = await import("./content-admin");
    return dbVerifyPracticePassword(lock.documentId, input);
  }
  return isPasswordMatch(input, lock.credential.password);
}

export async function hasPracticeCookie(credential: PracticeCredential) {
  return hasPracticeAccess(credential, (await cookies()).get(practiceCookieName(credential.examPath))?.value);
}

export const practiceCookieValue = (credential: PracticeCredential) => practiceToken(credential);

// ---------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------

// On the dev server, signing out bumps the epoch so copies of the old cookie stop working. It lives on
// globalThis so every route bundle shares it; a restart also starts a new epoch. A deployment runs on
// many short-lived instances that can't share an epoch, so there the epoch is fixed: signing out deletes
// the cookie, and changing ADMIN_PASSWORD (or AUTH_SECRET) signs every session out.
const epochStore = globalThis as typeof globalThis & { __hjsAdminEpoch?: string };
const adminEpoch = () => development() ? (epochStore.__hjsAdminEpoch ??= randomBytes(16).toString("hex")) : "deployed";
export const endAdminSessions = () => { epochStore.__hjsAdminEpoch = randomBytes(16).toString("hex"); };

function adminCredential(): AdminCredential | undefined {
  if (!adminAvailable()) return undefined;
  const secret = authSecret();
  const adminPassword = readAdminPassword(process.env);
  if (!adminPassword) warnMissing("ADMIN_PASSWORD");
  return secret && adminPassword ? { secret, adminPassword, epoch: adminEpoch() } : undefined;
}

/** The admin password to compare against, or a message naming what to configure. */
export function adminLoginTarget(): { credential: AdminCredential } | { error: string } {
  const credential = adminCredential();
  if (credential) return { credential };
  return { error: development()
    ? ".env.local에 ADMIN_PASSWORD와 32자 이상의 AUTH_SECRET을 설정한 뒤 개발 서버를 다시 시작해 주세요."
    : "관리자 모드가 설정되지 않았습니다." };
}

export const adminCookieOptions = () => ({ httpOnly: true, sameSite: "strict" as const, path: "/", maxAge: ADMIN_COOKIE_MAX_AGE, secure: !development() });
export const adminCookieValue = (credential: AdminCredential) => adminToken(credential);

/** True for a signed-in admin (local dev server, or a deployment with admin mode configured). */
export async function isAdminViewer() {
  const credential = adminCredential();
  return Boolean(credential && hasAdminSession(credential, (await cookies()).get(ADMIN_COOKIE_NAME)?.value));
}

/** Checks for an admin API request; signedIn is passed for sign-in itself, which can't require a session yet. */
export async function adminRefusal(request: Request, { mutation = request.method !== "GET", signedIn }: { mutation?: boolean; signedIn?: boolean } = {}) {
  const refusal = adminRequestError({
    nodeEnv: process.env.NODE_ENV, remoteAllowed: remoteAdminAllowed(),
    url: request.url, origin: request.headers.get("origin"), host: request.headers.get("host"),
    mutation, signedIn: signedIn ?? await isAdminViewer(),
  });
  return refusal && Response.json({ error: refusal.error }, { status: refusal.status });
}

/**
 * Every admin API calls this first. It returns the refusal to send, or undefined to continue.
 * Requests that change content must also come from this site (Origin must match Host).
 */
export const adminGuard = (request: Request, options: { mutation?: boolean } = {}) => adminRefusal(request, options);
