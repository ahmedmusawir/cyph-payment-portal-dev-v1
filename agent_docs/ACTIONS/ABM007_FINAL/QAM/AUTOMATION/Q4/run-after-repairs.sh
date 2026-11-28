#!/usr/bin/env bash
set -u
q=agent_docs/ACTIONS/ABM007_FINAL/QAM
r=/tmp/abm007-final-cody-q4
export PLAYWRIGHT_BROWSERS_PATH="$r/pw-browsers"
mkdir -p "$q/evidence/Q4/05"
run_phase() {
  local phase="$1" script="$2"
  node "$q/AUTOMATION/Q4/$script" > "$q/evidence/Q4/05/$phase-command.log" 2>&1
  local code=$?
  printf '%s %s\n' "$phase" "$code" | tee -a "$q/evidence/Q4/05/phase-exits.txt"
}
run_phase repair-diagnostics repair-diagnostics.mjs
run_phase full-matrix matrix.mjs
run_phase core core.mjs
run_phase loose-ends loose.mjs
