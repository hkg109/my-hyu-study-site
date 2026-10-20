import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { accessKeyError, DEFAULT_PRACTICE_PASSWORD_ENV, practicePasswordEnvName } from "../lib/access-keys";
import { ADMIN_COOKIE_MAX_AGE, adminRequestError, adminToken, hasAdminSession, hasPracticeAccess, isPasswordMatch, PRACTICE_COOKIE_MAX_AGE, practiceCookieName, practiceToken, readAdminPassword, readAuthSecret, readPracticePassword, safePracticePath, type PracticeCredential } from "../lib/access";
import { practiceAccessReference } from "../lib/academic-practice";
import { getSearchIndex } from "../lib/search";
import { readCollection } from "../lib/content";

// Fake values only. Real passwords live in .env.local or the hosting provider, never in the repository.
const SECRET = "test-auth-secret-0123456789abcdef-0123";
const OTHER_SECRET = "another-test-secret-0123456789abcdef";
const env = { AUTH_SECRET: SECRET, PRACTICE_PASSWORD_DEFAULT: "fake-default", PRACTICE_PASSWORD_CSE_MIDTERM: "fake-cse", ADMIN_PASSWORD: "fake-admin" };

const cseMidterm = ["grade-01", "semester-01", "subject-muhy8vqy", "exam-01"];
const misExam = ["grade-01", "semester-muheifg4", "subject-muhz2xir", "exam-01"];
const examPath = (slug: string[]) => `/practice/${slug.join("/")}`;
const credential = (overrides: Partial<PracticeCredential> = {}): PracticeCredential => ({ secret: SECRET, examPath: examPath(cseMidterm), accessKey: "cse-midterm", password: "fake-cse", ...overrides });

test("accessKey format, reserved words and env names are decided in one place", () => {
  assert.equal(practicePasswordEnvName(), DEFAULT_PRACTICE_PASSWORD_ENV);
  assert.equal(practicePasswordEnvName("cse-midterm"), "PRACTICE_PASSWORD_CSE_MIDTERM");
  assert.equal(practicePasswordEnvName("mis-2025-midterm"), "PRACTICE_PASSWORD_MIS_2025_MIDTERM");
  for (const bad of ["", "default", "CSE", "cse_midterm", "cse--midterm", "-cse", "cse-", "a".repeat(33), "../admin", "auth secret", 42, null]) {
    assert.ok(accessKeyError(bad), String(bad));
    if (typeof bad === "string") assert.throws(() => practicePasswordEnvName(bad));
  }
  assert.equal(accessKeyError("a".repeat(32)), undefined);
});

test("an exam with an accessKey only uses its own variable and never falls back to the default", () => {
  assert.equal(readPracticePassword(undefined, env), "fake-default");
  assert.equal(readPracticePassword("cse-midterm", env), "fake-cse");
  assert.equal(readPracticePassword("cse-final", env), undefined);
  assert.equal(readPracticePassword(undefined, { ...env, PRACTICE_PASSWORD_DEFAULT: "  " }), undefined);
  // Keys can't reach variables outside the PRACTICE_PASSWORD_ namespace.
  assert.throws(() => readPracticePassword("auth_secret", env));
});

test("missing or short AUTH_SECRET and missing ADMIN_PASSWORD read as unset", () => {
  assert.equal(readAuthSecret(env), SECRET);
  assert.equal(readAuthSecret({}), undefined);
  assert.equal(readAuthSecret({ AUTH_SECRET: "too-short" }), undefined);
  assert.equal(readAdminPassword(env), "fake-admin");
  assert.equal(readAdminPassword({}), undefined);
});

test("exams reference passwords by accessKey only", () => {
  assert.deepEqual(practiceAccessReference(cseMidterm), { accessKey: "cse-midterm" });
  assert.deepEqual(practiceAccessReference(misExam), {});
  assert.equal(practiceAccessReference(["grade-01", "semester-01", "subject-muhy8vqy", "exam-99"]), undefined);
  assert.equal(existsSync("config/access.json"), false);
  for (const doc of readCollection("practice")) {
    const reference = practiceAccessReference(doc.slug);
    assert.equal(reference?.error, undefined, doc.path);
  }
});

test("practice password check is exact", () => {
  assert.ok(isPasswordMatch("fake-cse", "fake-cse"));
  assert.ok(!isPasswordMatch("fake-cs", "fake-cse"));
  assert.ok(!isPasswordMatch("", "fake-cse"));
});

test("an exam cookie only unlocks that exam with its current password, key and secret", () => {
  const token = practiceToken(credential());
  assert.ok(hasPracticeAccess(credential(), token));
  assert.ok(!hasPracticeAccess(credential({ examPath: examPath(misExam) }), token), "another exam");
  assert.ok(!hasPracticeAccess(credential({ password: "fake-cse-rotated" }), token), "password changed");
  assert.ok(!hasPracticeAccess(credential({ accessKey: "cse-midterm-2" }), token), "accessKey changed");
  assert.ok(!hasPracticeAccess(credential({ accessKey: undefined }), token), "switched to the default password");
  assert.ok(!hasPracticeAccess(credential({ secret: OTHER_SECRET }), token), "AUTH_SECRET rotated");
  assert.ok(!hasPracticeAccess(credential(), undefined));
  assert.ok(!hasPracticeAccess(credential(), "fake-cse"));
  assert.notEqual(practiceCookieName(examPath(cseMidterm)), practiceCookieName(examPath(misExam)));
  assert.ok(!token.includes("fake-cse"), "the cookie never contains the password");
});

test("tampered, expired and old-format exam cookies are rejected", () => {
  const now = Date.UTC(2026, 9, 20);
  const token = practiceToken(credential(), now);
  const [version, expires, signature] = token.split(".");
  assert.ok(hasPracticeAccess(credential(), token, now));
  assert.ok(!hasPracticeAccess(credential(), `${version}.${Number(expires) + 60}.${signature}`, now), "extended expiry");
  assert.ok(!hasPracticeAccess(credential(), `${version}.${expires}.${signature.slice(0, -2)}AA`, now), "changed signature");
  assert.ok(!hasPracticeAccess(credential(), `v1.${expires}.${signature}`, now), "other version");
  assert.ok(!hasPracticeAccess(credential(), `${token}.extra`, now));
  assert.ok(!hasPracticeAccess(credential(), token, now + PRACTICE_COOKIE_MAX_AGE * 1000), "expired after 30 days");
  assert.ok(hasPracticeAccess(credential(), token, now + (PRACTICE_COOKIE_MAX_AGE - 60) * 1000), "valid within 30 days");
  // The previous format was a bare SHA-256 hex digest; it no longer opens anything.
  assert.ok(!hasPracticeAccess(credential(), "a".repeat(64), now));
});

test("admin sessions expire, end on sign-out and follow the admin password", () => {
  const now = Date.UTC(2026, 9, 20);
  const admin = { secret: SECRET, adminPassword: "fake-admin", epoch: "epoch-1" };
  const token = adminToken(admin, now);
  assert.ok(hasAdminSession(admin, token, now));
  assert.ok(!hasAdminSession({ ...admin, epoch: "epoch-2" }, token, now), "signed out");
  assert.ok(!hasAdminSession({ ...admin, adminPassword: "fake-admin-2" }, token, now), "password changed");
  assert.ok(!hasAdminSession(admin, token, now + ADMIN_COOKIE_MAX_AGE * 1000), "expired");
  assert.ok(!hasAdminSession(admin, practiceToken(credential(), now), now), "an exam cookie is not an admin cookie");
});

test("admin APIs require the local dev server, the same origin for changes and a session", () => {
  const request = { nodeEnv: "development", url: "http://localhost:3000/api/admin/notes/x", origin: "http://localhost:3000", host: "localhost:3000", mutation: true, signedIn: true };
  assert.equal(adminRequestError(request), undefined);
  assert.equal(adminRequestError({ ...request, nodeEnv: "production" })?.status, 404);
  assert.equal(adminRequestError({ ...request, url: "http://192.168.0.5:3000/api/admin/notes/x", host: "192.168.0.5:3000", origin: "http://192.168.0.5:3000" })?.status, 403);
  assert.equal(adminRequestError({ ...request, origin: "https://evil.example" })?.status, 403);
  assert.equal(adminRequestError({ ...request, origin: null })?.status, 403);
  assert.equal(adminRequestError({ ...request, origin: null, mutation: false }), undefined);
  assert.equal(adminRequestError({ ...request, signedIn: false })?.status, 401);
  assert.equal(adminRequestError({ ...request, url: "http://[::1]:3000/api", host: "[::1]:3000", origin: "http://[::1]:3000" }), undefined);
});

test("unlock redirects stay inside the practice section", () => {
  assert.equal(safePracticePath("/practice/grade-01/semester-muheifg4/subject-muhz2xir/exam-04"), "/practice/grade-01/semester-muheifg4/subject-muhz2xir/exam-04");
  assert.equal(safePracticePath("https://example.com/practice"), "/practice");
  assert.equal(safePracticePath("//example.com"), "/practice");
  assert.equal(safePracticePath("/lectures"), "/practice");
  assert.equal(safePracticePath(undefined), "/practice");
});

test("search index and browser-bound documents expose neither locked content nor access settings", () => {
  const practice = getSearchIndex().filter(entry => entry.kind === "practice");
  assert.ok(practice.length > 0);
  assert.ok(practice.every(entry => entry.body === ""));
  for (const doc of readCollection("practice")) assert.ok(!("accessKey" in doc) && !("password" in doc), doc.path);
});

test("the browser-side admin provider never receives the admin password", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  const provider = readFileSync("components/admin/AdminProvider.tsx", "utf8");
  assert.doesNotMatch(layout, /ADMIN_PASSWORD|readAdminPassword|expectedPassword/);
  assert.doesNotMatch(provider, /expectedPassword|ADMIN_PASSWORD/);
  assert.match(readFileSync("lib/server/auth.ts", "utf8"), /^import "server-only";/);
});
