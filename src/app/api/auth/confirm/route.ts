// APBM007A — emailed sign-in link landing (FC-4). GET shows; only the explicit POST verifies. See src/server/emailLink.ts.
import { type NextRequest } from "next/server";
import { confirmEntry, confirmSubmit } from "@/server/emailLink";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return confirmEntry(request);   // never calls verifyOtp, generateLink or creates a session
}

export async function POST(request: NextRequest) {
  return confirmSubmit(request);
}
