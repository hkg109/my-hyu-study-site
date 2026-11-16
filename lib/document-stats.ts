import { toString } from "mdast-util-to-string";
import { parseMarkdown } from "./markdown";
import { parseQuestionHeading } from "./exam-paper";

/** Match the heading level selected by the printable exam, without exposing question bodies. */
export function questionCount(source: string, format: "md" | "mdx" = "md") {
  const tree = parseMarkdown(source, format);
  const levels = new Map<number, number>();
  for (const node of tree.children) {
    if (node.type === "heading" && parseQuestionHeading(toString(node))) levels.set(node.depth, (levels.get(node.depth) ?? 0) + 1);
  }
  const numbered = [...levels.values()].sort((a, b) => b - a)[0];
  return numbered ?? tree.children.filter(node => node.data?.hProperties?.className?.includes("study-quiz")).length;
}
