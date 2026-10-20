import { adminGuard } from "@/lib/server/auth";
import { createDocumentFromTemplate } from "@/lib/server/create-document";

export async function POST(request: Request) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  return createDocumentFromTemplate("lectures", request);
}
