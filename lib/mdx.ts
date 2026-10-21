import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import type { Element, ElementContent, Root } from "hast";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getHeadings, remarkDocumentHeadings, remarkStudySyntax } from "./markdown";

function rehypeRawCode() {
  return (tree: Root) => {
    visit(tree, "element", node => {
      if (node.tagName !== "pre") return;
      const code = node.children.find(child => child.type === "element" && child.tagName === "code");
      if (code?.type === "element") node.properties["data-raw"] = code.children.filter(child => child.type === "text").map(child => child.value).join("").replace(/\n$/, "");
    });
  };
}

function rehypeDefaultLightCodeColors() {
  return (tree: Root) => {
    visit(tree, "element", node => {
      if (node.tagName !== "span" || typeof node.properties.style !== "string") return;
      const lightColor = /--shiki-light:([^;]+)/.exec(node.properties.style)?.[1];
      if (lightColor) node.properties.style += `;color:${lightColor}`;
    });
  };
}

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  return node.type === "element" ? node.children.map(textOf).join("") : "";
}

// Each cell carries its column header so narrow screens can stack rows as labelled cards.
function rehypeTableLabels() {
  return (tree: Root) => {
    visit(tree, "element", table => {
      if (table.tagName !== "table") return;
      const labels: string[] = [];
      visit(table, "element", node => {
        if (node.tagName === "thead") visit(node, "element", cell => { if (cell.tagName === "th") labels.push(textOf(cell).trim()); });
      });
      if (labels.length < 3 || !labels.some(Boolean)) return;
      table.properties.className = ["stack-table"];
      visit(table, "element", node => {
        if (node.tagName !== "tbody") return;
        for (const row of node.children) {
          if (row.type !== "element" || row.tagName !== "tr") continue;
          row.children.filter((cell): cell is Element => cell.type === "element" && cell.tagName === "td").forEach((cell, index) => {
            if (labels[index]) cell.properties["data-label"] = labels[index];
          });
        }
      });
    });
  };
}

export async function renderMDX(source: string, format: "md" | "mdx" = "mdx") {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      // Author-maintained repository content only. JavaScript expressions stay disabled.
      blockJS: true,
      mdxOptions: {
        format,
        remarkPlugins: [remarkGfm, remarkStudySyntax, remarkDocumentHeadings],
        rehypePlugins: [rehypeRawCode, rehypeTableLabels, [rehypePrettyCode, { theme: { light: "light-plus", dark: "dark-plus" }, keepBackground: false }], rehypeDefaultLightCodeColors],
      },
    },
  });
  return { content, headings: getHeadings(source, format) };
}
