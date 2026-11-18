// APBM-007B — read-only served-build identity (ENGINEERING_COMMANDS.md "Build identity"): app, revision, artifact id only.
import { NextResponse } from 'next/server';
import { APP_ID } from '@/lib/appIdentity';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ app: APP_ID, revision: process.env.APBM_BUILD_REVISION ?? 'unrecorded', artifactId: process.env.APBM_BUILD_ARTIFACT_ID ?? 'unlabelled-build' },
    { headers: { 'Cache-Control': 'no-store' } });
}
