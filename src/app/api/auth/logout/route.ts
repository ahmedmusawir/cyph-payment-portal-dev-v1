import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { logoutEverywhere } from "@/server/handoff";

// Ensure this route is always dynamic and not cached
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// APBM007A: provider-wide sign-out (D-02). Pending handoff codes are invalidated first; a provider failure is
// reported honestly (502) so the UI can offer a retry instead of claiming the user is signed out everywhere.
export async function POST() {
  const { ok } = await logoutEverywhere();
  revalidatePath("/", "layout");
  const res = ok
    ? NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
    : NextResponse.json({ error: "sign_out_incomplete", message: "You are signed out on this browser, but we couldn't confirm sign-out everywhere. Try again." }, { status: 502 });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}
