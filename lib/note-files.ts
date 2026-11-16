import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { setFrontmatterField } from "./frontmatter-edit";
import type { TemplateKind } from "./note-templates";

const prefix = (kind: TemplateKind) => kind === "practice" ? "exam" : "lecture";

/** The next order and file id in a subject, counting drafts and files of any number so nothing is reused. */
export function nextDocumentSlot(kind: TemplateKind, directory: string) {
  const pattern = new RegExp(`^${prefix(kind)}-(\\d+)\\.mdx?$`);
  const names = fs.existsSync(directory) ? fs.readdirSync(directory) : [];
  const orders: number[] = [];
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

/** Reads an optional requested position from a request: undefined when empty, null when invalid. */
export function parseRequestedOrder(value: unknown): number | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  const order = Number(value);
  return Number.isInteger(order) && order >= 1 && order <= 999 ? order : null;
}

/** Moves every document at `order` or later in a subject folder back by one, so `order` is free. */
export function makeRoomAt(kind: TemplateKind, directory: string, order: number) {
  if (!fs.existsSync(directory)) return;
  const names = fs.readdirSync(directory).filter(name => /\.mdx?$/.test(name) && name.startsWith(`${prefix(kind)}-`));
  if (!names.some(name => Number(matter(fs.readFileSync(path.join(directory, name), "utf8")).data.order) === order)) return;
  for (const name of names) {
    const file = path.join(directory, name);
    const source = fs.readFileSync(file, "utf8");
    const current = Number(matter(source).data.order);
    if (Number.isInteger(current) && current >= order) fs.writeFileSync(file, setFrontmatterField(source, "order", String(current + 1)).replace(/^order: "(\d+)"(?=\r?$)/m, "order: $1"));
  }
}
