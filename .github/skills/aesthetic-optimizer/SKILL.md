---
name: aesthetic-optimizer
description: "Improve visual quality, responsiveness, accessibility, and frontend performance without changing core logic, architecture, or essential configuration. Defaults to whole-project optimization, applies aggressive-but-safe UI/CSS polish, generates reversible diffs, and suggests optional upgrades only when significant improvement is detected."
argument-hint: "Constraints and do-not-change zones (defaults to whole-project optimization)"
user-invocable: true
disable-model-invocation: false
---

# Aesthetic Optimizer

## Outcome
- Applies safe visual and responsive improvements automatically.
- Defaults to whole-project optimization when no narrower scope is provided.
- Uses a more aggressive intervention level for UI/CSS polish while preserving essential configuration.
- Preserves product identity: layout intent, color relationships, shape language, and typography scale.
- Keeps core logic and architecture unchanged.
- Produces a reversible diff and a short summary of what changed.
- Proposes optional enhancements only when significant improvement is detected.

## When To Use
- UI feels misaligned, cramped, inconsistent, or visually noisy.
- Responsive behavior is weak across breakpoints.
- CSS includes dead or redundant styles.
- Motion feels abrupt or heavy.
- Accessibility and performance need polish without redesigning the product.

## Inputs
- Target scope: defaults to whole project; optionally page or component set.
- Constraints: do-not-change zones, brand or design-system rules.
- Essential configuration boundaries: files and settings that must remain untouched.

## Workflow
1. Analyze the current UI and infer design language.
2. Detect structure and constraints.
3. Apply aggressive-but-safe improvements automatically.
4. Validate accessibility and responsiveness.
5. Run performance and CSS hygiene passes.
6. Generate a reversible diff summary.
7. Suggest optional enhancements only if significant gains are identified.

## Detailed Procedure

### 1) Analyze And Preserve Identity
- Inspect layout structure, component hierarchy, breakpoints, interaction patterns, and design language.
- Infer spacing rhythm, typographic scale, color relationship patterns, and shape language.
- Record non-negotiables before editing.

### 2) Aggressive-But-Safe Automatic Improvements
- Layout and spacing:
  - Normalize spacing tokens and vertical rhythm.
  - Improve alignment and table readability.
  - Refine text-image flow and responsive behavior.
  - Resolve inconsistent density and outlier spacing across views.
  - Tighten or relax section rhythm where scanability is improved.
- Visual harmony:
  - Preserve relative color balance and typography hierarchy.
  - Avoid unreadable text and contrast regressions.
  - Harmonize component-level visual noise when style intent is unclear.
- Motion:
  - Add subtle transitions, smooth image loading, and gentle scroll effects.
  - Respect `prefers-reduced-motion` and avoid clarity loss.
  - Replace abrupt motion patterns with coherent interaction timing.
- Accessibility:
  - Preserve visible focus states.
  - Maintain readable contrast and clear interaction feedback.
- Performance:
  - Remove unused CSS and redundant style blocks.
  - Prefer GPU-friendly animation properties.
  - Enable lazy loading and improve bundle efficiency where safe.
- Code organization:
  - Normalize indentation and style grouping.
  - Improve non-functional naming where it aids readability.

### 3) Decision Points
- If a change risks altering product identity, move it to optional enhancements.
- If contrast can only be fixed by changing palette relationships, stop and request approval.
- If motion could reduce clarity or accessibility, use simpler transitions.
- If optimization requires architecture, logic, or essential configuration changes, do not apply automatically.

### 4) Diff And Reversibility
- Group edits by category: spacing, responsiveness, accessibility, performance, cleanup.
- Keep changes small and reversible.
- Do not include logic, architectural, or essential configuration refactors.

### 5) Significant Improvement Detection
- Suggest optional enhancements only when at least one of these is true:
  - A clear UX gain is observed in readability, scanability, or navigation clarity.
  - A measurable performance gain is projected from optional changes.
  - The UI shows visible inconsistency that safe changes cannot fully resolve.
- If no significant gain is detected, report: "Safe optimization complete. No optional enhancements recommended."

### 6) Optional Enhancements (Approval Required)
- Expressive animations.
- Enhanced spacing scale.
- Improved typography rhythm.
- Optional layout refinements.
- Optional color harmonization.
- Component polish.

Apply only after explicit user approval.

## Completion Checklist
- Core logic and architecture unchanged.
- Design identity preserved.
- Responsiveness improved on target breakpoints.
- Accessibility maintained or improved.
- Performance not regressed.
- Diff is reversible and clearly categorized.
- Optional upgrades listed only when significant improvement is detected.
- Essential configuration remains unchanged.

## Response Style
- Keep tone neutral and minimal.
- Prefer short status lines:
  - "Spacing normalized. Layout preserved."
  - "Contrast improved. Color relationships preserved."
  - "Unused CSS removed."
  - "Optional enhancements available."