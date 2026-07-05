import type {IconName} from "~/components/base/Ico.vue"

/**
 * A humanized configuration chip on a Rich List Item. Callers translate raw config
 * (e.g. `contribution_strategy`) into these — the generic card never interprets them.
 * See app/components/common/CONTEXT.md (authoring guide).
 */
export type RichFacet = {
    label: string | number
    icon?: IconName
}

/** '+' asset/inflow · '-' outflow/liability · '' neutral. Prefixes a headline value. */
export type RichSign = '+' | '-' | ''
