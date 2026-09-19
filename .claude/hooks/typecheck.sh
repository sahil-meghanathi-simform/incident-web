#!/usr/bin/env bash
# Stop hook — project-wide typecheck once the turn is finished.
#
# This deliberately does NOT run per-edit: during a multi-file change the
# intermediate states legitimately don't compile, and blocking on every one of
# them turns a normal refactor into a wall of noise.
#
# Exit 0 = clean. Exit 2 = stderr fed back to Claude to fix.
# Set CLAUDE_SKIP_TSC=1 to disable.

set -uo pipefail

payload=$(cat)

# Claude is already here because this hook blocked once. Don't block twice —
# that is how a Stop hook becomes an infinite loop.
if [ "$(printf '%s' "$payload" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

[ "${CLAUDE_SKIP_TSC:-0}" != "1" ] || exit 0

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -f "$root/package.json" ] || exit 0
cd "$root" || exit 0
npx --no-install tsc --version >/dev/null 2>&1 || exit 0

# `tsc --noEmit` alone resolves the root tsconfig.json, which is a solution-style
# stub (`{"files": [], "references": [...]}`) — outside build mode tsc ignores
# `references` and silently compiles zero files, always exiting 0. `-b` is what
# actually walks the referenced project and checks the real source tree.
log=$(mktemp)
if ! npx --no-install tsc -b --noEmit >"$log" 2>&1; then
  {
    echo "tsc --noEmit is failing — architecture.md requires typecheck clean before a change is handed over:"
    echo
    sed 's/^/  /' "$log" | head -40
  } >&2
  rm -f "$log"
  exit 2
fi

rm -f "$log"
exit 0
