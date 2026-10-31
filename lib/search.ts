import { readCollection } from "./content";
import { markdownText } from "./markdown";
import type { SearchEntry } from "@/types/content";

let productionIndex: SearchEntry[] | undefined;

export function getSearchIndex(): SearchEntry[] {
  // Building the index reads every lecture and takes seconds; every page's layout asks for it.
  // Content is fixed for a production build, so pages share one copy instead of rebuilding it.
  if (process.env.NODE_ENV === "production") return productionIndex ??= buildSearchIndex();
  return buildSearchIndex();
}

function buildSearchIndex(): SearchEntry[] {
  return (["lectures", "practice"] as const).flatMap(kind =>
    readCollection(kind).map(doc => ({
      title: doc.title, description: doc.description, tags: doc.tags ?? [],
      // The index ships with every page, so locked practice content is searchable by title only.
      body: kind === "practice" ? "" : markdownText(doc.content, doc.format), path: doc.path, week: doc.week, kind,
      location: kind === "lectures" ? [doc.gradeName, doc.semesterName, doc.subjectName].filter(Boolean).join(" · ") : "족보",
    })),
  );
}
