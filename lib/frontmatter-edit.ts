// Changes one single-line frontmatter field while keeping every other byte of the file as it was.
// Re-serializing with gray-matter would requote titles and reflow the YAML, so this edits lines instead.

/** Sets `field: "value"`, or removes the field when value is undefined. Throws when the file has no frontmatter. */
export function setFrontmatterField(source: string, field: string, value: string | undefined) {
  if (!/^[A-Za-z][\w-]*$/.test(field)) throw new Error(`올바르지 않은 frontmatter 필드입니다: ${field}`);
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(eol);
  if (lines[0] !== "---") throw new Error("frontmatter가 없는 파일입니다.");
  const closing = lines.indexOf("---", 1);
  if (closing < 0) throw new Error("frontmatter가 닫히지 않았습니다.");
  const fieldLine = new RegExp(`^${field}\\s*:`);
  const header = lines.slice(1, closing);
  const position = header.findIndex(line => fieldLine.test(line));
  const kept = header.filter(line => !fieldLine.test(line));
  // JSON quoting keeps values such as "2025" or "true" strings when YAML reads them back.
  // An existing field keeps its place; a new one goes last.
  if (value !== undefined) kept.splice(position < 0 ? kept.length : position, 0, `${field}: ${JSON.stringify(value)}`);
  return ["---", ...kept, ...lines.slice(closing)].join(eol);
}
