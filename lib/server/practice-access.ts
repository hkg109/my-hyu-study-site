import "server-only";
import { accessKeyError } from "@/lib/access-keys";
import type { AccessChoice } from "@/types/admin";

/** Validates an access choice from a request body (file mode writes it into the exam's frontmatter). */
export function parseAccessChoice(value: unknown): { choice: AccessChoice } | { error: string } {
  const input = value as { mode?: unknown; accessKey?: unknown } | undefined;
  if (input?.mode === "default") return { choice: { mode: "default" } };
  if (input?.mode !== "key") return { error: "접근 방식을 선택해 주세요." };
  const error = accessKeyError(input.accessKey);
  return error ? { error } : { choice: { mode: "key", accessKey: input.accessKey as string } };
}
