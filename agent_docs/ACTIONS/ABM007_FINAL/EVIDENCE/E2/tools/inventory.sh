#!/usr/bin/env bash
# Change inventory in four lists (QAM_MANIFEST section 2). Usage: inventory.sh <repo> <baseline> <out_file>
set -euo pipefail
cd "$1"; b=$2
{
echo "# $(basename "$PWD")  baseline $b  HEAD $(git rev-parse HEAD)  branch $(git branch --show-current)  taken $(date -u +%FT%TZ)"
echo; echo "## 1. Committed since baseline:  git diff --name-status $b HEAD"; git diff --name-status "$b" HEAD
echo; echo "## 2. Staged:  git diff --cached --name-status"; git diff --cached --name-status
echo; echo "## 3. Unstaged:  git diff --name-status"; git diff --name-status
echo; echo "## 4. Untracked:  git ls-files -o --exclude-standard"; git ls-files -o --exclude-standard
} > "$3"
