# Rich List Item — authoring guide

`common/RichListItem.vue` is a **generic, reusable** expandable ledger-row card. It knows nothing
about finance, models, or commands — it owns **layout only** — so it can back any listing page,
inside a command sequence or not. Domains fill its zones via slots.

Delivered by #83 (brokerage = reference domain). Domain rollout: #84–91. Rationale: root
`CONTEXT.md` → "Rich List Item", "Headline Value", "Facet", "Sparkline vs graph".

## Layering (nothing above depends on the layer below knowing it)

```
common/RichListItem.vue   generic card — layout, collapse/expand, actions, zones. No finance, no command.
        ▲ used by
<domain>/ListItem.vue     domain content — fills the zones from its own data. Reusable on ANY page.
        ▲ composed by
command/Sequence.vue      command layer — wraps drag handle + active switch + reorder around the item.
```

The domain list item **does not import the command layer** and can be dropped on a plain listing
page. The command layer depends on the item, never the reverse.

## The generic card (`<common-rich-list-item>`)

Props: `expanded?: boolean`. Emits: `toggle`, `edit`, `delete`. It owns the collapsed row layout,
the chevron, the default edit/delete actions, and the expanded chart+aside scaffold.

**Zones (slots) — fill the ones you need:**

| slot | position | notes |
|------|----------|-------|
| `icon` | leading | e.g. `<base-ico name="brokerage" class="text-skin-info">` |
| `title` | after icon | the entity name |
| `strategy` | chip | **optional** — omit it and no chip renders. Not every entity has a strategy. |
| `sparkline` | trailing | drop in `<base-sparkline :series :active :tone>` |
| `headline` | far right | value + label, right-aligned (the punchline) |
| `actions` | end | defaults to edit/delete buttons; override only if needed |
| `chart` | expanded, 2/3 | e.g. `<common-rich-list-item-chart>` |
| `aside` | expanded, 1/3 | projection (Today → headline), the facet list, education affordance |

Mobile is handled by the card: value+label stack (no fixed widths — never re-add `w-28`/`w-20`,
they overflowed), strategy chip hides `< sm`, expanded grid → single column with aside above chart.

`is_active` (dim/grey) and `expanded` are **owned by the command layer** (`Sequence.vue`) because
they are per-sequence; the wrapper dims the whole row and passes `is-active`/`expanded`/`@toggle`
into the domain item.

## What a domain wrapper does (copy `brokerage/ListItem.vue`)

1. Inject `managerStates`; derive a **`series`** from the entity's per-year state history
   (investments → `balance_end_of_year`).
2. Compute the **headline** (domain-defined punchline): investments → projected balance at
   retirement (`sign '+'`, label `"at retirement"`); cash_reserve → target reserve (`''`);
   income → annual gross year 0 (`+`); expense → annual amount year 0 (`-`); debt → remaining
   principal (`-`, label `"payoff <year>"`).
3. Humanize config into **`RichFacet`s** (`~/types/richListItem`) — the card never interprets.
   `contribution_strategy` → `"10% of income"` / `"Maxing out"` / `"$1,000/yr"`. **Strategy is
   optional** — if the entity has none, don't render the `#strategy` slot.
4. Forward `:is-active` / `:expanded` / `@toggle`; keep emitting `update` / `delete`.

## Colour (design-system safe)

Sparkline colour = a skin text token via `currentColor` (theme-aware, no hex). Chart.js can't read
CSS vars, so `constants/ModelChartColor.ts` resolves the live palette var at runtime
(`resolveModelRgb`). Never hardcode hex in a component. See ADR 008.

## Edge cases (resolved in #83)

- **Headline when the plan never retires:** use the **last available** `series` point, falling back
  to the initial balance. No fabricated retirement value.
- **"Current year" for income/expense headline:** year 0 (`series[0]`).

## Migration status

**Complete.** All nine domains (brokerage, income, expense, debt, cash_reserve, tax_deferred,
roth_ira, ira, hsa) render `common/RichListItem`. The legacy `command/ListItem.vue` slot card and
the throwaway prototype (`app/pages/prototype/rich-list-item.vue`,
`app/components/prototype/richListItem/`) have been deleted (#92). This card is now the single list
row for every entity, inside a command sequence or on a plain listing page.
