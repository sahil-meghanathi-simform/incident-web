#!/usr/bin/env bash
# PostToolUse hook — enforces the machine-checkable parts of .claude/rules/ after
# an Edit/Write under src/ or e2e/.
#
# Exit 0  = clean, nothing said.
# Exit 2  = violations found; stderr is fed back to Claude to fix.
#
# Cheap per-file grep checks first, then eslint --fix on the one file. The
# project-wide typecheck runs on Stop instead (.claude/hooks/typecheck.sh):
# mid-refactor, an intermediate file legitimately doesn't compile yet.
#
# Sanctioned exceptions: the rules permit a handful of these patterns in
# specific cases (a genuinely dynamic inline style, a hidden file input, a
# @ts-expect-error with an upstream cause). Acknowledge one with a `rules-ok:`
# comment on the offending line or the line directly above, naming the reason:
#
#   {/* rules-ok: measured width, tailwind.md permits dynamic values */}
#   <div style={{ width }} />
#
# The file-naming and folder-casing checks have no offending line, so they take
# a file-level acknowledgement instead: any `rules-ok:` comment in the file that
# also contains the word `naming`.
#
# An acknowledgement is a claim you have to justify to a reviewer, not a mute
# button — if you can't name the sanctioned case, fix the code instead.

set -uo pipefail

payload=$(cat)
file=$(printf '%s' "$payload" | jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')

[ -n "$file" ] || exit 0
[ -f "$file" ] || exit 0

case "$file" in
  *src/*.ts|*src/*.tsx|*e2e/*.ts) ;;
  *) exit 0 ;;
esac

root=${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null || pwd)}
rel=${file#"$root"/}
base=$(basename "$file")

# The path as the rules describe it: everything from the final `src/` or `e2e/`
# segment onward, so the naming checks below can't be confused by an uppercase
# directory somewhere above the project root (~/Desktop/...).
case "$file" in
  */src/*) scoped="src/${file##*/src/}" ;;
  */e2e/*) scoped="e2e/${file##*/e2e/}" ;;
  *)       scoped="$rel" ;;
esac
problems=()

add() { problems+=("$1"); }

# True when line $1 (or the line above it) carries a `rules-ok:` acknowledgement.
suppressed() {
  local ln=$1 prev
  prev=$(( ln > 1 ? ln - 1 : 1 ))
  sed -n "${prev}p;${ln}p" "$file" | grep -q 'rules-ok:'
}

# Emit `line:content` for every match of regex $1, minus acknowledged lines.
# Every check goes through this, so what gets reported is exactly what tripped.
scan() {
  local hit ln
  while IFS= read -r hit; do
    ln=${hit%%:*}
    suppressed "$ln" && continue
    printf '%s\n' "$hit"
  done < <(grep -nE "$1" "$file")
}

# ── typescript.md ──────────────────────────────────────────────────────────────
hits=$(scan '(:|<)[[:space:]]*any\b|\bas any\b|Array<any>')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -3)
  — typescript.md bans \`any\` in every form. Narrow with a type guard or validate with Zod."
fi

hits=$(scan '@ts-ignore')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -3)
  — typescript.md: \`@ts-ignore\` is never allowed. Use \`@ts-expect-error\` with a comment naming the upstream cause, and only for third-party type problems."
fi

while IFS= read -r hit; do
  [ -n "$hit" ] || continue
  ln=${hit%%:*}
  prev=$(( ln > 1 ? ln - 1 : 1 ))
  if ! sed -n "${prev}p;${ln}p" "$file" | grep -qE '(—|--|:).*[a-zA-Z]{4}'; then
    add "  $rel:$ln — \`@ts-expect-error\` needs a comment naming the upstream cause and what would let it go (typescript.md)."
  fi
done < <(scan '@ts-expect-error')

hits=$(scan 'React\.FC|React\.FunctionComponent')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -3)
  — typescript.md bans \`React.FC\`. Type the props parameter directly."
fi

# Per-property `readonly` inside a `type` body. awk tracks the enclosing
# declaration so an `interface` — the sanctioned case, since a utility type
# cannot wrap one — is skipped, and so is a body opened on a continuation line.
hits=""
while IFS= read -r hit; do
  [ -n "$hit" ] || continue
  ln=${hit%%:*}
  suppressed "$ln" && continue
  hits+="$hit"$'\n'
done < <(awk '
  /^[[:space:]]*(export[[:space:]]+)?(declare[[:space:]]+)?interface[[:space:]]/ { mode = "iface"; next }
  /^[[:space:]]*(export[[:space:]]+)?type[[:space:]]+[A-Za-z0-9_]+.*=.*\{/       { mode = "type";  next }
  /^\}/                                                                          { mode = "";      next }
  mode == "type" && /^[[:space:]]+readonly[[:space:]]+[A-Za-z_$]/ { printf "%d:%s\n", NR, $0 }
' "$file")
if [ -n "$hits" ]; then
  add "  $(printf '%s' "$hits" | head -3)
  — typescript.md: immutability is stated once for the shape — wrap the body in \`Readonly<{ ... }>\` instead of a \`readonly\` modifier per property. Arrays inside it stay \`readonly T[]\`."
fi

hits=$(scan '^[[:space:]]*(export[[:space:]]+)?(const[[:space:]]+)?enum[[:space:]]')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -3)
  — typescript.md bans the \`enum\` keyword. Use an \`as const\` object plus its derived union."
fi

hits=$(scan 'tabIndex=\{[1-9]')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -3)
  — accessibility.md: never a positive tabIndex. Fix the DOM order instead."
fi

hits=$(scan '^[[:space:]]*export default')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -2)
  — components.md: named exports only, never default."
fi

# ── architecture.md: 300-line cap ──────────────────────────────────────────────
lines=$(wc -l < "$file")
if [ "$lines" -gt 300 ]; then
  add "  $rel is $lines lines — over the 300-line cap (architecture.md). Identify a cohesive extraction; mention it before adding files."
fi

# ── hooks.md: no JSX in a feature hook ────────────────────────────────────────
# The `.ts` extension already makes JSX a compile error; this stays as a second
# line of defence and to give the rule-shaped message rather than a tsc one.
# A bare <Identifier> is a type argument — useForm<Values>, useState<User | null>
# — which hooks.md and forms.md both require, so the
# pattern needs a closing tag, an attribute, a self-close, or a returned element.
JSX_RE='</[A-Za-z][A-Za-z0-9]*>|<[A-Z][A-Za-z0-9]*[[:space:]]+[a-zA-Z-]+=|<[A-Z][A-Za-z0-9]*[[:space:]]*/>|return[[:space:]]*\(?[[:space:]]*<|<>'
case "$base" in
  use*Hook.ts)
    hits=$(scan "$JSX_RE")
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — hooks.md: no JSX in a feature hook file, ever. Move it to the paired Component."
    fi
    if ! grep -qE 'export (const|function) use[A-Z][A-Za-z]*Hook' "$file"; then
      add "  $rel — hooks.md: a feature hook file exports exactly one hook named \`use<Feature>Hook\`."
    fi
    ;;
esac

# ── components.md: a Component never imports src/queries ──────────────────────
case "$base" in
  *Component.tsx)
    hits=$(scan "from[[:space:]]+['\"](@/|[./]*)[Qq]ueries/")
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — components.md: a <feature>Component.tsx never imports from src/queries/. Data reaches it through use<Feature>Hook."
    fi
    ;;
esac

# ── state-management.md ───────────────────────────────────────────────────────
hits=$(scan 'useContext\(')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -2)
  — state-management.md: consume Context through its typed hook (useAuthContext()), never useContext() at a call site."
fi

# ── tailwind.md: no hardcoded colors, arbitrary px, @apply, or CSS-in-JS ──────
case "$file" in
  *.tsx)
    hits=$(scan '(bg|text|border|ring|fill|stroke|from|to|via)-\[#[0-9a-fA-F]{3,8}\]|#[0-9a-fA-F]{6}\b')
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — tailwind.md: no hardcoded hex. Map to a \`--color-*\` token in the @theme block in src/index.css."
    fi
    hits=$(scan '(m|p)[trblxy]?-\[[0-9]+px\]|(w|h|gap|top|left|right|bottom)-\[[0-9]+px\]')
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — tailwind.md: no arbitrary pixel values. Use the nearest step on the spacing scale."
    fi
    hits=$(scan 'style=\{\{')
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -2)
  — tailwind.md: inline style objects only for genuinely dynamic values (a computed transform, a measured width). Otherwise use utilities. If this is the dynamic case, acknowledge it with a \`rules-ok:\` comment naming the value."
    fi
    hits=$(scan "from[[:space:]]+['\"](styled-components|@emotion|class-variance-authority)")
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -2)
  — tailwind.md: utilities only. No CSS-in-JS and no variant-styling library; this project has decided against adding one."
    fi
    ;;
esac

# ── components.md: list keys ──────────────────────────────────────────────────
case "$file" in
  *.tsx)
    hits=$(scan 'key=\{(index|i|idx)\}|key=\{Math\.random|key=\{`?\$\{?(index|i|idx)')
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — components.md: a key is a stable ID belonging to the item, never the array index or a render-time value."
    fi
    ;;
esac

# ── labels.md / routing.md: no inline copy or hardcoded paths ─────────────────
case "$base" in
  *Component.tsx|use*Hook.ts)
    hits=$(scan "(navigate|to)=?\(?[[:space:]]*['\"]/[a-z]")
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -3)
  — routing.md: route paths come from ROUTES in src/shared/constants/routes.ts, never a literal."
    fi
    ;;
esac

# ── testing.md ────────────────────────────────────────────────────────────────
case "$file" in
  *e2e/*.ts|*.spec.ts)
    hits=$(scan 'waitForTimeout')
    if [ -n "$hits" ]; then
      add "  $(printf '%s\n' "$hits" | head -2)
  — testing.md: web-first assertions only. Never waitForTimeout."
    fi
    ;;
esac

# ── security.md ───────────────────────────────────────────────────────────────
hits=$(scan '(local|session)Storage\.(set|get)Item\([[:space:]]*[`"'\'']?[^)]*(token|Token|jwt|JWT|auth|Auth)')
if [ -n "$hits" ]; then
  add "  $(printf '%s\n' "$hits" | head -2)
  — security.md: tokens never go in localStorage or sessionStorage. In-memory Context, or an httpOnly cookie."
fi
if grep -qE 'dangerouslySetInnerHTML' "$file" && ! grep -qE 'DOMPurify|sanitize' "$file"; then
  hits=$(scan 'dangerouslySetInnerHTML')
  if [ -n "$hits" ]; then
    add "  $(printf '%s\n' "$hits" | head -2)
  — security.md: dangerouslySetInnerHTML requires a sanitizer on the value plus a comment naming where the HTML came from."
  fi
fi
if grep -qE 'target="_blank"' "$file" && ! grep -qE 'noopener' "$file"; then
  add "  target=\"_blank\" in $rel is missing rel=\"noopener noreferrer\" (security.md)."
fi

# ── architecture.md: folders lowercase, files camelCase ───────────────────────
# Pure string checks on the path — no grep, so no false positives. A file-level
# `rules-ok: naming` anywhere in the file acknowledges a genuine exception.
naming_ok() { grep -q 'rules-ok:.*naming' "$file"; }

case "$base" in
  [A-Z]*)
    naming_ok || add "  $scoped — architecture.md: filenames are camelCase. Rename to \`$(printf '%s' "${base:0:1}" | tr '[:upper:]' '[:lower:]')${base:1}\`; the export keeps its own PascalCase name."
    ;;
esac

bad_dirs=$(dirname "$scoped" | awk -F/ '{ for (i = 1; i <= NF; i++) if ($i ~ /^[A-Z]/) printf "%s ", $i }')
if [ -n "$bad_dirs" ]; then
  naming_ok || add "  $scoped — architecture.md: folders are lowercase (camelCase when multi-word). Rename: $bad_dirs"
fi

# ── components.md: every feature route is wrapped in ErrorBoundary ────────────
# Walks each <Route …> element and requires a boundary. The catch-all <Navigate>
# route renders no feature, so it is exempt.
case "$base" in
  *routes.tsx)
    while IFS= read -r hit; do
      [ -n "$hit" ] || continue
      ln=${hit%%:*}
      suppressed "$ln" && continue
      add "  $scoped:$ln — components.md: every feature route is wrapped in \`ErrorBoundary\`, so one broken screen can't blank the app."
    done < <(awk '
      /<Route/                  { inroute = 1; buf = ""; start = NR }
      inroute                   { buf = buf " " $0 }
      inroute && (/\/>/ || /<\/Route>/) {
        inroute = 0
        if (buf ~ /element=\{/ && buf !~ /ErrorBoundary/ && buf !~ /Navigate/) printf "%d:%s\n", start, buf
      }
    ' "$file")
    ;;
esac

# ── eslint ────────────────────────────────────────────────────────────────────
tooling=""
if [ -f "$root/package.json" ] && npx --no-install eslint --version >/dev/null 2>&1; then
  log=$(mktemp)
  if ! npx --no-install eslint --fix "$file" >"$log" 2>&1; then
    tooling="
eslint:
$(sed 's/^/  /' "$log" | head -40)"
  fi
  rm -f "$log"
fi

if [ ${#problems[@]} -eq 0 ] && [ -z "$tooling" ]; then
  exit 0
fi

{
  echo "Rule violations in $rel — fix these before moving on:"
  echo
  for p in "${problems[@]}"; do echo "$p"; done
  [ -n "$tooling" ] && echo "$tooling"
} >&2

exit 2
