# STACK_CHANGE.md — Architecture Revision

## Status

Approved architecture change.

Previous planned stack:

```text
Next.js
React
TypeScript
```

Current planned stack:

```text
Astro
TypeScript
vanilla client-side TypeScript
static output
```

Decision date: 2026-08-14.

## Why

The actual product is a static SEO page with two textareas, a few controls and a deterministic browser-side transformation.

It currently has no need for auth, server data, backend, database, SPA navigation or complex component state.

Next/React was a safe general-purpose choice, but it adds machinery that is not required by the product.

The broader business direction also favors multiple small durable browser utilities. A lighter static-first pattern reduces runtime JS, dependencies, maintenance, hosting needs and agent over-abstraction.

## What does not change

PRODUCT, UX, DESIGN, SEO strategy, comparison semantics, privacy rules, analytics model and launch experiment remain the same.

This is an implementation simplification, not a product redesign.

## Repository assessment at the decision point

The repository has completed `CL-001` through `CL-006`.

Reusable without framework coupling:

```text
comparison types and defaults
domain tests
typed English content
design tokens and base style values
formatting, Vitest and CI intent
```

Next/React-specific and expected to be replaced during migration:

```text
Next package/configuration
React dependencies and type packages
App Router layout/page components
React-only test setup
Next-specific ESLint configuration
CSS Module wiring around the page shell
```

No parser, comparison engine or interactive React feature exists yet. The
migration is therefore small enough to approve now. Pure domain files must be
preserved; framework-specific files may be removed only inside the dedicated
migration task.

## New model

```text
Astro build
↓
static HTML
+
small bundled TypeScript script
↓
pure comparison engine
```

No UI-framework hydration.

## Agent instruction

If implementation has not started: use Astro.

If only Next scaffold/minimal work exists: migration should be cheap; report what will be removed/replaced, then proceed within assigned scope.

If substantial Next/React implementation exists: do not delete it automatically. Report what exists, what is reusable, what must be rewritten, migration scope/risk and whether keeping the current stack may be cheaper.

The goal is simplicity, not framework purity at any cost.

## Immediate implementation decision

The next task is the dedicated Astro foundation migration recorded as
`CL-007` in `IMPLEMENTATION_PLAN.md`. Domain work resumes only after that PR is
reviewed and the static Astro build is green.

## Updated authoritative files

```text
ARCHITECTURE.md
AGENTS.md
LAUNCH_PLAN.md
STACK_CHANGE.md
IMPLEMENTATION_PLAN.md
```

## Decision rule

Do not add a frontend framework merely because it is familiar. Framework introduction now requires a concrete unmet requirement and owner approval.
