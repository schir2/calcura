# ADR 014: A plan seeds from the user profile; it does not reference it

**Status:** Accepted
**Date:** 2026-07-13

## Context

`profiles` carries `birthday` and `life_expectancy`. `plan` carries `age`, `year`, and
`life_expectancy`. That looks like duplication, and the obvious "fix" is to drop the plan
columns and read the user's profile instead — one source of truth.

That fix is wrong, and the reason is the same one that justifies `plan.year` existing at all.

**`plan.year` is the anchor of the year-indexed limit schedule.** Contribution and tax limits
are per-year; the plan's starting year is what those lookups are resolved against (and is the
seam where a future API would fetch or estimate the limits for that year). A plan authored in
2023 must keep simulating from 2023 — it must not silently drift to the current year, or its
limit schedule stops matching the person it was written for.

**`plan.age` is one half of that anchor.** `age` and `year` are a pair: *"this plan simulates a
person aged A in calendar year Y."* If `age` were derived live from `profiles.birthday`, a plan
authored at age 30 in 2023 would today simulate from age 33 while still anchored to year 2023.
The pair breaks, and the plan silently becomes a different plan. This is exactly the drift
`year` exists to prevent.

`life_expectancy` is a different kind of field. It is not an anchor — it is an **assumption**
("what if I live to 95?"), and a user may legitimately want to vary it across scenarios while
their profile value stays put.

## Decision

**The user profile is the *seed* for a new plan, not the *source of truth* for an existing one.**

1. At create time, the wizard pre-fills `plan.age` from `profiles.birthday` and
   `plan.life_expectancy` from `profiles.life_expectancy`. `plan.year` is seeded to the current
   year.
2. Once created, the plan **owns frozen copies**. Editing the profile never rewrites an
   existing plan. There is no live reference and no back-sync.
3. All three stay **editable on the plan**, in the Workspace's cold "Timeline" tab. Drift
   immunity comes from *not auto-syncing*, not from locking the fields — a typo'd age must be
   correctable without rebuilding the plan.

## Alternatives considered

- **Live reference (drop `plan.age` / `plan.life_expectancy`, read the profile).** Rejected:
  it reintroduces exactly the drift `plan.year` exists to prevent, and it silently mutates every
  saved plan the moment the user edits their profile. It also makes `life_expectancy` un-varyable
  per scenario, which kills a legitimate modeling question.
- **Seed, but lock the fields on the plan.** Rejected: over-corrects. Immutability is not what
  buys drift immunity — the absence of a live binding is. Locking only makes mistakes permanent.
- **Back-sync (edit the plan, update the profile).** Rejected: a plan is a *scenario*, and
  scenarios are hypothetical. "What if I live to 95" must not change what the app believes about
  the real user.

## Consequences

**Positive:**
- Plans are independent, reproducible scenarios. A plan means the same thing next year as it did
  the day it was written.
- The year-indexed limit schedule stays coherent with the person the plan describes.
- `life_expectancy` becomes a real lever you can vary per scenario.

**Negative / Trade-offs:**
- The duplication is real and will look like a bug to anyone who hasn't read this ADR. That is
  precisely why it is written down.
- Profile edits do not propagate. A user who corrects their birthday must fix their plans by
  hand. Accepted — the alternative is silent rewriting, which is worse. A future "your profile
  changed — update this plan?" prompt is possible, but it must be an explicit user action.

## Related

- [[Plan fields that are not levers]] — `plan.growth_rate` (dead) and `plan.tax_strategy`
  (single-value enum) are excluded from the Workspace for unrelated reasons.
- CONTEXT.md → "Workspace target — the Plan is one, but it is not an Entity".
