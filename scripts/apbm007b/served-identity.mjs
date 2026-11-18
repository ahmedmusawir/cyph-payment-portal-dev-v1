#!/usr/bin/env node
// APBM-007B — served-build identity (ENGINEERING_COMMANDS.md "Build identity"). cwd: Portal root.
//
//   node scripts/apbm007b/served-identity.mjs --help
//   node scripts/apbm007b/served-identity.mjs --base <origin> --manifest <manifest_<app>.json> [--port <n>]
//
// Compares GET <base>/api/build-info (app, revision, artifactId) with the build manifest written by build-check.mjs, and
// binds the listening process: the PID on --port (default from --base), its cwd, start time and the .next/BUILD_ID on disk
// in that cwd. A disk BUILD_ID or process start time alone is NOT accepted as proof; all three must agree. Reads only.
import { execSync } from 'node:child_process';
import { readFileSync, readlinkSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const base = opt('--base'), manifestPath = opt('--manifest');
if (!base || !manifestPath) { console.error('FAIL-CLOSED: --base and --manifest required'); process.exit(2); }
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const port = Number(opt('--port') ?? new URL(base).port);
const http = await (await fetch(`${base}/api/build-info`, { cache: 'no-store' })).json();
let proc = null;
try {
  const line = execSync(`ss -ltnpH 'sport = :${port}'`, { encoding: 'utf8' }).trim();
  const pid = Number(/pid=(\d+)/.exec(line)?.[1]);
  if (pid) {
    const cwd = readlinkSync(`/proc/${pid}/cwd`);
    const buildIdPath = [join(cwd, '.next/BUILD_ID'), join(cwd, 'BUILD_ID')].find(existsSync);
    proc = { pid, cwd, started: execSync(`ps -o lstart= -p ${pid}`, { encoding: 'utf8' }).trim(), disk_build_id: buildIdPath ? readFileSync(buildIdPath, 'utf8').trim() : null,
      build_id_mtime: buildIdPath ? statSync(buildIdPath).mtime.toISOString() : null };
  }
} catch { proc = null; }
const result = { base, http, manifest: { app: manifest.app, artifact_id: manifest.artifact_id, revision: manifest.revision, next_build_id: manifest.next_build_id }, process: proc };
result.match = http.artifactId === manifest.artifact_id && http.revision === manifest.revision && http.app === manifest.app
  && !!proc && proc.disk_build_id === manifest.next_build_id;
console.log(JSON.stringify(result, null, 1));
process.exitCode = result.match ? 0 : 1;
