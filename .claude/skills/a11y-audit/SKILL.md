---
name: a11y-audit
description: Use when checking accessibility — "is this screen accessible", "audit the login page for a11y", "keyboard test this feature", "check contrast and screen reader support", "run an accessibility pass before we ship". Audits a feature or the whole app against `.claude/rules/accessibility.md` by reading the code and driving the running app with the keyboard, then reports what fails and where. Do NOT use to build a new screen (`new-feature`, `add-primitive` — both already require accessibility as you go); this is verification after the fact.
---

## Overview

`.claude/rules/accessibility.md` states the app is fully keyboard-operable as a requirement, not a polish pass. Nothing in the repo verifies that claim. This skill does.

An audit that only reads code finds maybe half the real failures — focus traps, focus loss on navigation, and unreachable controls only appear when you actually press Tab. So this runs in two halves, and the second half is the one that matters.

## Scope

Ask which if the request doesn't say: one feature, one flow, or the whole app. Default to the feature or flow named. Auditing everything at once produces a report nobody acts on — prefer depth on one flow.

## Part 1 — Static pass

Read the feature's Component file, any `components/` subfolder, and every `shared/components/` primitive it uses. Check each item and note the file and line for anything that fails.

**Semantics**
- Semantic elements where they mean something — `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`. Exactly one `main` per page.
- `button` for actions, `a` for navigation. **Any `div` or `span` with `onClick` is a failure.**
- `ul`/`ol`/`li` for lists; `table`/`thead`/`tbody`/`th` for tabular data.
- One `h1`, heading levels descending without skips.
- `form` wrapping fields so Enter submits; `fieldset` + `legend` around related groups.
- No `role` duplicating what the element already means (`role="button"` on a `button`).

**Names and labels**
- Every input has an associated `label` — visible, or `sr-only` where the design can't show one. A placeholder is not a label.
- Icon-only controls carry `aria-label`.
- Decorative icons beside visible text carry `aria-hidden="true"`.
- Images carry `alt`; decorative ones `alt=""`.
- Field errors link to their input via `aria-describedby` and set `aria-invalid`.

**Async and state**
- Loading and error states announce through `aria-live` — `polite` for status, `assertive` for errors.
- No state signalled by color alone; each is paired with an icon, label, or shape.
- Where a control is unavailable, the reason is in visible or accessible adjacent text — **not** a tooltip on a disabled control, which is unreachable by keyboard.

**Focus and motion**
- No positive `tabIndex` anywhere.
- No removed outline without a replacement.
- `prefers-reduced-motion` respected on any transition longer than a hover state.

## Part 2 — Live keyboard pass

Start the app with the `run` skill, navigate to the screen, and drive it with the Chrome tools. Do not skip this because part 1 looked clean.

1. **Tab through the entire screen.** Screenshot at each stop. For every stop, confirm: focus is *visibly* indicated, the order is logical and matches the visual layout, and nothing is skipped. Note anything reachable that shouldn't be, and anything unreachable that should be.
2. **Check the focus indicator's contrast**, not just its presence. A ring that doesn't clear 3:1 against its background is a failure even though it technically exists.
3. **Activate every control from the keyboard** — Enter and Space on buttons, Enter to submit the form. Anything that only responds to a click is a failure.
4. **Open every dialog, modal, popover, and dropdown** and verify all three: focus moves in, Tab stays trapped inside, Escape closes it, and focus returns to the trigger. This is the most commonly broken item in the whole audit.
5. **Composite widgets** — menus, tabs, listboxes, radio groups — move with arrow keys, not only Tab.
6. **Submit the form with invalid input** from the keyboard. Confirm the error is reachable, associated with its field, and announced.
7. **Force loading and error states** with `page.route()` or by throttling, and confirm each is announced rather than only rendered.
8. **Resize to 375px** and Tab through again — a mobile layout often reorders or hides controls.

Avoid any control that triggers a native `confirm()` or `alert()`; it will freeze the browser session. Warn the user first if the flow requires one.

## Part 3 — Report

Group findings by severity, and make each one actionable. For every finding: the file and line, what fails, which rule it breaks, and the fix.

- **Blocking** — a keyboard user cannot complete the flow. An untrapped modal, an unreachable primary action, a `div` with `onClick` on the main path.
- **Serious** — completable but degraded. A missing label, an unannounced error, an invisible focus ring, contrast below threshold.
- **Minor** — polish. A heading skip, a decorative icon missing `aria-hidden`.

State plainly what you verified and what you could not. If a state was unreachable or a check wasn't possible, say so rather than passing it silently — an audit that overstates its coverage is worse than a short one.

Then offer to fix the findings. Blocking and serious items usually belong in the primitive rather than the feature: if three screens have an invisible focus ring, the fix is one change in `shared/components/`, not three.

## Rules

- Never report the app as accessible on a static read alone. Part 2 is mandatory.
- Never claim a check passed that you didn't run.
- A finding without a file, a line, and a fix is not a finding.
- Fix at the lowest shared level — the primitive before the feature.
