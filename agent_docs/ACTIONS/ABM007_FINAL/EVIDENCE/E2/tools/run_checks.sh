#!/bin/bash
# ABM007_FINAL E2 completion: full checks on the hash-bound copies, placeholder public values only (no backend).
S="$1"; : > "$S/logs/summary.txt"
for app in ob pp; do
  port=$([ $app = ob ] && echo 3300 || echo 3301)
  cd "$S/$app"
  export CI=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_APP_ENV=local NEXT_PUBLIC_SITE_URL=http://localhost:$port \
         NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54399 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-not-a-key
  [ $app = ob ] && export NEXT_PUBLIC_APBM_DATA_MODE=mock || unset NEXT_PUBLIC_APBM_DATA_MODE
  for step in "test:npx jest --ci" "typecheck:npx tsc --noEmit -p ." "lint:npx eslint ." "build:npx next build"; do
    name=${step%%:*}; cmd=${step#*:}; start=$(date +%s)
    $cmd > "$S/logs/${app}_${name}.log" 2>&1; code=$?
    echo "$app $name exit=$code secs=$(( $(date +%s) - start ))" >> "$S/logs/summary.txt"
  done
done
echo DONE >> "$S/logs/summary.txt"
