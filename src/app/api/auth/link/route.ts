// APBM007A — request an emailed sign-in link. Generic answer; never creates a user.
import { type NextRequest } from "next/server";
import { requestSignInLink } from "@/server/emailLink";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return requestSignInLink(request);
}
