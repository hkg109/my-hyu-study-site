import { getSearchIndex } from "@/lib/search";

// Served once as its own file and fetched only when someone opens search,
// instead of riding along in every page's HTML and RSC payload.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getSearchIndex());
}
