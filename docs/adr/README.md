# Architecture Decision Records

This directory records significant architectural decisions made during development.
Each ADR captures the context, decision, and consequences so future contributors
understand *why* the codebase is shaped the way it is.

## Index

| # | Title | Status |
|---|-------|--------|
| [001](001-supabase-over-django.md) | Replace Django backend with Supabase | Accepted |
| [002](002-bigint-identity-primary-keys.md) | BIGINT GENERATED ALWAYS AS IDENTITY for all PKs | Accepted |
| [003](003-numeric-for-financial-values.md) | NUMERIC for all financial columns | Accepted |
| [004](004-postgres-triggers-over-edge-functions.md) | Postgres triggers for all automation | Accepted |
| [005](005-snake-case-field-names.md) | snake_case throughout TypeScript types | Accepted |
| [006](006-income-id-on-junction-tables.md) | IRA income association lives on junction table | Accepted |
| [007](007-supabase-redirect-false.md) | Disable @nuxtjs/supabase redirect middleware | Accepted |
| [008](008-design-tokens-tailwind-source-of-truth.md) | Design tokens: palette.ts as single source of truth | Accepted |
| [009](009-hsa-not-income-linked.md) | HSA is not income-linked; health-insurance modeling deferred | Accepted |

## Format

Each ADR follows this structure:
- **Status**: Proposed / Accepted / Superseded / Deprecated
- **Context**: What situation forced this decision
- **Decision**: What was decided
- **Consequences**: What becomes easier, harder, or different as a result
