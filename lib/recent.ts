// The last documents this browser opened, newest first. Stored per browser like the completion marks.
export const RECENT_KEY = "hyu-hjs-study-recent";
export const RECENT_LIMIT = 8;

const DOCUMENT_PATH = /^\/(?:lectures|practice)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){4}$/;

export function parseRecent(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item): item is string => typeof item === "string" && DOCUMENT_PATH.test(item)))].slice(0, RECENT_LIMIT);
  } catch { return []; }
}

export const pushRecent = (paths: string[], path: string) => DOCUMENT_PATH.test(path) ? [path, ...paths.filter(item => item !== path)].slice(0, RECENT_LIMIT) : paths;
