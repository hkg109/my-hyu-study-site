// Turning an uploaded markdown file and its images into a document. Pure functions, shared by the
// upload API and the admin dialog's preview (so the dialog can warn about images that weren't attached).

export const IMAGE_TYPES: Record<string, string> = {
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif",
};
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;

/** A storage-safe file name: keeps letters, digits, dot, dash and underscore. */
export function safeFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? name;
  const cleaned = base.normalize("NFC").replace(/[^\w.\-가-힣]/g, "-").replace(/-+/g, "-").replace(/^[-.]+/, "");
  return cleaned.slice(-100) || "image";
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Image paths a markdown body points at that are local (not http(s), not data:, not site-absolute).
 * Covers ![alt](path "title") and <img src="path">.
 */
export function localImageReferences(body: string): string[] {
  const found = new Set<string>();
  for (const match of body.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) found.add(match[1]);
  for (const match of body.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) found.add(match[1]);
  return [...found].filter(src => !/^(?:[a-z]+:|\/\/|\/|#)/i.test(src));
}

/** Rewrites references to uploaded images (by file name, with or without a folder) to their public URLs. */
export function rewriteImageReferences(body: string, uploaded: Map<string, string>) {
  let result = body;
  for (const reference of localImageReferences(body)) {
    const url = uploaded.get(safeFileName(decodeURIComponent(reference)));
    if (!url) continue;
    result = result.replace(new RegExp(`(\\]\\(\\s*<?|\\bsrc=["'])${escape(reference)}(?=[>)\\s"'])`, "g"), `$1${url}`);
  }
  return result;
}

/** Title from frontmatter, else the first "# " heading, else the file name. */
export function guessTitle(frontmatterTitle: unknown, body: string, fileName: string) {
  if (typeof frontmatterTitle === "string" && frontmatterTitle.trim()) return frontmatterTitle.trim().slice(0, 120);
  const heading = /^#\s+(.+)$/m.exec(body)?.[1]?.trim();
  if (heading) return heading.slice(0, 120);
  return fileName.replace(/\.(md|mdx|markdown)$/i, "").slice(0, 120) || "새 문서";
}
