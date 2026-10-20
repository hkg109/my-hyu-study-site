import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { TemplateKind } from "./note-templates";

const prefix = (kind: TemplateKind) => kind === "practice" ? "exam" : "lecture";

/** The next order and file id in a subject, counting drafts and files of any number so nothing is reused. */
export function nextDocumentSlot(kind: TemplateKind, directory: string, existingOrders: number[]) {
  const pattern = new RegExp(`^${prefix(kind)}-(\\d+)\\.mdx?$`);
  const names = fs.existsSync(directory) ? fs.readdirSync(directory) : [];
  const orders = [...existingOrders];
  for (const name of names) {
    if (!/\.mdx?$/.test(name) || !name.startsWith(`${prefix(kind)}-`)) continue;
    const order = Number(matter(fs.readFileSync(path.join(directory, name), "utf8")).data.order);
    if (Number.isInteger(order)) orders.push(order);
    const numbered = pattern.exec(name);
    if (numbered) orders.push(Number(numbered[1]));
  }
  const order = Math.max(0, ...orders) + 1;
  return { order, id: `${prefix(kind)}-${String(order).padStart(2, "0")}` };
}
