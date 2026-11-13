// APBM007A — operator recovery endpoint. See src/server/operator.ts. Refuses anything without the derived token.
import { type NextRequest, NextResponse } from "next/server";
import { listUnfinishedEvents, listUnresolved, operatorAuthorized, reconcileOne, recoverEvent } from "@/server/operator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: NextRequest) {
  if (!operatorAuthorized(request.headers.get("authorization"))) return json({ error: "not_found" }, 404);
  try { return json({ operations: await listUnresolved(), events: await listUnfinishedEvents() }); } catch { return json({ error: "provider_unavailable" }, 502); }
}

export async function POST(request: NextRequest) {
  if (!operatorAuthorized(request.headers.get("authorization"))) return json({ error: "not_found" }, 404);
  const body = (await request.json().catch(() => ({}))) as { operationId?: unknown; eventId?: unknown };
  try {
    if (body.eventId !== undefined) return json(await recoverEvent(String(body.eventId)));
    return json(await reconcileOne(String(body.operationId ?? "")));
  } catch { return json({ error: "provider_unavailable" }, 502); }
}
