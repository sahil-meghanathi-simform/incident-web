---
name: figma-ui
description: Use when the user provides a Figma URL/frame/node and wants it built as a screen or component in this repo — "build this Figma design", "implement the screen at <figma url>", "convert this frame into a component". Extracts design context via the Figma MCP (or a screenshot when no MCP is connected) and maps it to this project's `@theme` tokens in `src/index.css`, shared/components primitives, and the three-file feature pattern. Do NOT use without a Figma reference, for backend/logic-only work, or for editing existing components that aren't tied to a design.
---

## Overview

Convert a Figma frame into a production-ready screen or component for this project, following the three-file feature pattern and the rules in `.claude/rules/`. The Figma MCP output is raw material, not a template — this repo's conventions always win over whatever markup, class names, or structure Figma hands back.

## Workflow

### 1. Preflight — confirm you can actually read the design

Before anything else, establish which source of truth you have. Do not start building on a guess about the design.

**Look for a Figma MCP tool.** The tool names depend on which server is connected, so check what is actually available rather than assuming:

- The hosted connector surfaces as `mcp__claude_ai_Figma__*`.
- A locally configured server surfaces under whatever name it was given in `.mcp.json` or settings (commonly `mcp__figma__*` or `mcp__figma-dev-mode-mcp-server__*`).
- The tool you want is the design-context one — usually `get_design_context` (named `get_code` on older versions). Companions worth using when present: `get_screenshot` for a reference image, `get_variable_defs` for the file's own design variables, `get_metadata` for the layer tree.

Then take exactly one of these three paths:

**A — the tool is available.** Call it for the given URL/frame/node. Also call `get_screenshot` if it exists: an image of the intended result is worth more than the markup, and you need it for step 12. Treat everything returned as reference only — colors, spacing, typography, and layout intent — never copy its output verbatim into the codebase.

**B — a Figma server is installed but unauthenticated.** You will see only an `authenticate` tool (e.g. `mcp__claude_ai_Figma__authenticate`) rather than the real ones. Call it, give the user the authorization URL it returns, and wait. Do not attempt to build in the meantime. Once they authorize, the real tools appear and you continue on path A.

**C — no Figma tooling at all.** Stop and say so in one sentence, then offer the two ways forward rather than guessing:

- The user pastes or attaches a **screenshot** of the frame. This is a genuinely good fallback — read it with the Read tool and work from the image plus their description of behavior. Ask for the specific values an image can't carry: exact colors if they matter, breakpoint behavior, and any interaction states.
- The user connects the Figma MCP, and you resume from path A.

Never invent the design. If you have neither MCP access nor an image, you do not have a design to implement, and building "something like it" wastes the user's time.

### 2. Load this project's design tokens

This project is on Tailwind v4, so tokens live in the `@theme` block in `src/index.css` — there is no `tailwind.config.ts`. Read that block for the actual color, spacing, font, and breakpoint scale before mapping anything (`.claude/rules/tailwind.md`).

### 3. Discover before creating

- `src/shared/components/` — Button, Panel, the `Field/` controls (TextField, TextAreaField, SelectField, CheckboxField), Toast, Dialog, Alert, and anything else already built.
- The target feature's existing `<feature>Component.tsx`, if this is an addition to a feature that already exists.
- `src/shared/constants/labels.ts` and `routes.ts` for copy and paths that may already exist.

Never build a second version of something that already lives in `shared/components/`.

### 4. Map Figma values to project tokens

| Figma value | Maps to |
|---|---|
| Fill / stroke color | Nearest `--color-*` in `@theme`, used by its generated name (`bg-primary`, `text-muted-foreground`, etc.) |
| Spacing (padding, gap, margin) | Nearest step on the Tailwind spacing scale |
| Font size / weight | Nearest `text-*` / `font-*` combination the theme generates |
| Corner radius, shadow | Nearest token in `@theme` |
| Icons | `lucide-react` exclusively — never an inline SVG or a second icon set |

If nothing in `@theme` is close enough, use the nearest existing token and flag the gap to the user instead of silently adding a new variable — that block is a shared design-system surface, not something to extend mid-feature.

### 5. Decide placement

- **New screen or flow** → new `src/features/<feature>/` folder with the three files (`.claude/rules/architecture.md`).
- **Addition to an existing feature** → extend that feature's existing three files. Never add a fourth file at the feature root without raising it first; a `components/` subfolder for an oversized page is the sanctioned split.
- **A piece that's already reused, or obviously will be, across features** → `src/shared/components/`, presentation only, no business logic.

### 6. Build the three files

- **`<feature>.type.ts`** — camelCase feature name plus `.type.ts`; props, the hook's return type, and (for forms) the Zod schema plus its inferred type. No JSX. See `.claude/rules/typescript.md` and `.claude/rules/forms.md`.
- **`use<Feature>Hook.ts`** — the `use<Feature>Hook`. Wires `src/queries/` hooks for any data the screen needs, React Hook Form + Zod for any form, handlers, and navigation. No JSX ever. See `.claude/rules/hooks.md`.
- **`<feature>Component.tsx`** — JSX only, consumes the hook, renders exactly the states the feature hook exposes. Never imports from `src/queries/` directly. See `.claude/rules/components.md`.

### 7. Style

Tailwind utilities only, merged with `cn()`. Mobile-first. Class order: layout → box model → typography → visual → state variants (`.claude/rules/tailwind.md`). When a class string repeats a third time, extract a shared component — this project does not use `cva` or any variant-styling library.

### 8. Cover every state the design implies

- Interaction states on every interactive element: hover, active/pressed, disabled, focus-visible.
- Data states the feature actually has: loading (content-shaped skeleton), error (explain + recovery action), empty (explain + next action), content.

See `.claude/rules/components.md`.

### 9. Accessibility, as you build

Semantic elements over `div`s, every input labeled, full keyboard operability, visible focus, `aria-live` on async state changes, decorative icons `aria-hidden="true"`, icon-only controls `aria-label`. See `.claude/rules/accessibility.md`.

### 10. Copy

Every user-visible string comes from `shared/constants/labels.ts` — never lift text straight from Figma layer names or copy. Add missing entries there rather than inlining them.

### 11. Validate

`npm run lint` and `npm run typecheck` must both pass clean. The `.claude/hooks/check-rules.sh` hook will already have flagged token, key, export, and boundary violations as you wrote each file — clear those rather than leaving them. No file over 300 lines (`.claude/rules/architecture.md`) — split before crossing it, not after.

### 12. See it, then compare it

A design implementation is not done because it compiles. Run it and look at it.

1. Use the `run` skill to start the app, and navigate to the new screen.
2. Screenshot it with the Chrome tools.
3. Put that screenshot beside the Figma reference from step 1 — the `get_screenshot` output, or the image the user provided — and compare deliberately, in this order:
   - **Layout** — is the structure and the order of elements right? Are the proportions close?
   - **Spacing rhythm** — does the vertical and horizontal spacing read like the design, or is everything slightly too tight or too loose?
   - **Typography** — size hierarchy and weight, not just the font family.
   - **Color roles** — the right token in the right place. Exact hex parity is not the goal; the design system wins over the Figma fill.
4. Fix what's off and screenshot again. Two or three passes is normal.
5. Resize to 375px and check the mobile layout, since `.claude/rules/tailwind.md` requires it and Figma frames are usually desktop-only.
6. Do a keyboard pass: Tab through every interactive element, confirm focus is visible at each stop, and activate the primary action with Enter.

Then report the deliberate divergences from the design — where you used the nearest token instead of an exact Figma value, any `@theme` gap you hit in step 4, and anything the design didn't specify that you had to decide. That list is the useful part of the handover; "done" is not.

## Rules

- Never copy Figma MCP output verbatim — adapt it to this project's conventions.
- Never build from an assumed design. No MCP and no screenshot means no design — ask, don't approximate (step 1).
- Never report a screen as finished without having looked at it running (step 12).
- Never introduce a new UI or styling library (no shadcn/ui, no `cva`, no CSS-in-JS) without asking first — this project has already decided against adding one. Tailwind v4's own `@theme` variables are the sanctioned token mechanism and are not covered by this rule.
- A component never imports from `src/queries/` directly — data reaches it only through the feature hook.
- No hardcoded hex colors, pixel-exact one-off spacing, or literal inline copy — map everything to the `@theme` tokens in `src/index.css` and `shared/constants`.
- A feature root stays at exactly three files. Raise it before adding a fourth there. A `features/<feature>/components/` subfolder for a page too large for one Component file is allowed (`.claude/rules/components.md`) and doesn't count against this.
