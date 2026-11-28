#!/usr/bin/env bash
# ABM007_FINAL amendment B: assemble an isolated verification copy from a repository's ACTUAL working tree
# (tracked files as they are on disk, including staged and unstaged edits, plus untracked non-ignored files).
# Usage: assemble.sh <repo_dir> <dest_dir> <evidence_dir>
# Excluded: .env* files (credentials), agent_docs/ (records), node_modules (copied separately, unchanged).
set -euo pipefail
repo=$(cd "$1" && pwd); dest=$2; ev=$3; name=$(basename "$repo")
mkdir -p "$dest" "$ev"
cd "$repo"
{ echo "# $name  HEAD $(git rev-parse HEAD)  taken $(date -u +%FT%TZ)"; git status --porcelain=v1 -uall; } > "$ev/${name}_status.txt"
git ls-files -co --exclude-standard -z | tr '\0' '\n' | grep -vE '(^|/)\.env' | grep -v '^agent_docs/' | sort > "$ev/${name}_inventory.txt"
while IFS= read -r f; do [ -f "$f" ] && { mkdir -p "$dest/$(dirname "$f")"; cp -p "$f" "$dest/$f"; }; done < "$ev/${name}_inventory.txt"
# bind copy to inventory: hash every inventoried file in the source tree and in the copy
( while IFS= read -r f; do [ -f "$f" ] && sha256sum "$f"; done < "$ev/${name}_inventory.txt" ) > "$ev/${name}_source.sha256"
( cd "$dest" && sha256sum -c --quiet "$ev/${name}_source.sha256" ) && echo "copy matches working-tree inventory: $(wc -l < "$ev/${name}_source.sha256") files"
ls -a "$dest" | grep -E '^\.env' && { echo "ENV FILE PRESENT - abort"; exit 1; } || true
