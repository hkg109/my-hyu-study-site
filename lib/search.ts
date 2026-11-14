import { getCollectionWithBodies } from "./content";
import { markdownText } from "./markdown";
import type { SearchEntry } from "@/types/content";

let productionIndex: Promise<SearchEntry[]> | undefined;

export function getSearchIndex(): Promise<SearchEntry[]> {
  // Building the index reads every lecture and takes seconds. With file content, a production build
  // is fixed, so requests share one copy. DB content can change, so it is rebuilt when the
  // /search-index route is regenerated (it is static and refreshed with the content tag).
  if (process.env.NODE_ENV === "production" && process.env.CONTENT_SOURCE !== "db") return productionIndex ??= buildSearchIndex();
  return buildSearchIndex();
}

async function buildSearchIndex(): Promise<SearchEntry[]> {
  const kinds = ["lectures", "practice"] as const;
  const collections = await Promise.all(kinds.map(kind => getCollectionWithBodies(kind)));
  return kinds.flatMap((kind, i) => collections[i].map(doc => ({
    title: doc.title, description: doc.description, tags: doc.tags ?? [],
    // The index ships with every page, so locked practice content is searchable by title only.
    body: kind === "practice" ? "" : markdownText(doc.content, doc.format), path: doc.path, kind,
    location: kind === "lectures" ? [doc.gradeName, doc.semesterName, doc.subjectName].filter(Boolean).join(" · ") : "족보",
  })));
}
