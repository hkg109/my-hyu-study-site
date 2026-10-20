// An exam's `accessKey` names the environment variable that holds its password.
// This is the only place that validates keys and maps them to variable names. It never
// reads environment variables itself, so the admin UI can share it to show those names.

export const ACCESS_KEY_MAX_LENGTH = 32;
export const PRACTICE_PASSWORD_PREFIX = "PRACTICE_PASSWORD_";
export const DEFAULT_PRACTICE_PASSWORD_ENV = `${PRACTICE_PASSWORD_PREFIX}DEFAULT`;

// No underscores: `cse-midterm` and `cse_midterm` would otherwise share one variable.
const ACCESS_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// `default` would map onto the shared PRACTICE_PASSWORD_DEFAULT.
const RESERVED_ACCESS_KEYS = new Set(["default"]);

export function accessKeyError(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return "accessKey를 입력해 주세요.";
  if (value.length > ACCESS_KEY_MAX_LENGTH) return `accessKey는 ${ACCESS_KEY_MAX_LENGTH}자 이하로 입력해 주세요.`;
  if (!ACCESS_KEY_PATTERN.test(value)) return "accessKey는 소문자 영문·숫자와 단어 사이의 하이픈(-)만 쓸 수 있습니다. 예: cse-midterm";
  if (RESERVED_ACCESS_KEYS.has(value)) return `'${value}'는 예약어라 쓸 수 없습니다. 기본 비밀번호를 쓰려면 '기본 비밀번호 사용'을 고르세요.`;
  return undefined;
}

export const isAccessKey = (value: unknown): value is string => accessKeyError(value) === undefined;

/** The variable holding an exam's password. No key means the shared default. Throws for an invalid key. */
export function practicePasswordEnvName(accessKey?: string) {
  if (accessKey === undefined) return DEFAULT_PRACTICE_PASSWORD_ENV;
  const error = accessKeyError(accessKey);
  if (error) throw new Error(error);
  return `${PRACTICE_PASSWORD_PREFIX}${accessKey.toUpperCase().replaceAll("-", "_")}`;
}
