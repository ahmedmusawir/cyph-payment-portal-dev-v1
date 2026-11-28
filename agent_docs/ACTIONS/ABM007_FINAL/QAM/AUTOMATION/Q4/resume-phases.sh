#!/usr/bin/env bash
set -u
q=agent_docs/ACTIONS/ABM007_FINAL/QAM
export PLAYWRIGHT_BROWSERS_PATH=/tmp/abm007-final-cody-q4/pw-browsers
export PW_TEST_SCREENSHOT_NO_FONTS_READY=1
run_phase() {
 local label="$1" script="$2"
 shift 2
 node "$q/AUTOMATION/Q4/$script" "$@" > "$q/evidence/Q4/05/$label-command.log" 2>&1
 local code=$?
 printf '%s %s\n' "$label" "$code" | tee -a "$q/evidence/Q4/05/phase-exits.txt"
}
printf '%s\n' 'full-matrix-second INCOMPLETE (second scripts-disabled public group)' >> "$q/evidence/Q4/05/phase-exits.txt"
run_phase full-matrix matrix.mjs --resume-unrecorded
run_phase core core.mjs
run_phase loose-ends loose.mjs
