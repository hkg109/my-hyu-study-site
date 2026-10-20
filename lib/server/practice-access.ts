import "server-only";
import { accessKeyError, DEFAULT_PRACTICE_PASSWORD_ENV, practicePasswordEnvName } from "@/lib/access-keys";
import { readAuthSecret, readPracticePassword } from "@/lib/access";
import { practiceAccessKeyUsage, practiceAccessReference } from "@/lib/academic-practice";
import type { AccessChoice, AccessKeyStatus, PracticeAccessOverview, PracticeDocumentAccess } from "@/types/admin";

// Reports which password variables are set on this machine. Only the variables that practice
// exams reference are checked, and only as booleans: values never leave this module.

const configured = (accessKey?: string) => Boolean(readPracticePassword(accessKey, process.env));
const keyStatus = (accessKey: string, documents = 0): AccessKeyStatus => ({ accessKey, envName: practicePasswordEnvName(accessKey), configuredLocally: configured(accessKey), documents });

export function practiceAccessOverview(candidate?: string): PracticeAccessOverview {
  const usage = practiceAccessKeyUsage();
  const keys = [...usage].sort(([a], [b]) => a.localeCompare(b)).map(([accessKey, documents]) => keyStatus(accessKey, documents));
  return {
    defaultEnvName: DEFAULT_PRACTICE_PASSWORD_ENV,
    defaultConfiguredLocally: configured(),
    authSecretConfiguredLocally: Boolean(readAuthSecret(process.env)),
    keys,
    ...(candidate !== undefined && !accessKeyError(candidate) && { candidate: keyStatus(candidate, usage.get(candidate) ?? 0) }),
  };
}

export function practiceDocumentAccess(slug: string[]): PracticeDocumentAccess | undefined {
  const reference = practiceAccessReference(slug);
  if (!reference) return undefined;
  if (reference.error !== undefined) return { mode: "default", envName: DEFAULT_PRACTICE_PASSWORD_ENV, configuredLocally: false, problem: reference.error };
  if (!reference.accessKey) return { mode: "default", envName: DEFAULT_PRACTICE_PASSWORD_ENV, configuredLocally: configured() };
  return { mode: "key", accessKey: reference.accessKey, envName: practicePasswordEnvName(reference.accessKey), configuredLocally: configured(reference.accessKey) };
}

/** Validates an access choice from a request body. */
export function parseAccessChoice(value: unknown): { choice: AccessChoice } | { error: string } {
  const input = value as { mode?: unknown; accessKey?: unknown } | undefined;
  if (input?.mode === "default") return { choice: { mode: "default" } };
  if (input?.mode !== "key") return { error: "접근 방식을 선택해 주세요." };
  const error = accessKeyError(input.accessKey);
  return error ? { error } : { choice: { mode: "key", accessKey: input.accessKey as string } };
}
