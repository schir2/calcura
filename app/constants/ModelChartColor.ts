import type {ModelName} from "#shared/types/ModelName"

/*
 * Chart.js colors for the Rich List Item expanded graph.
 *
 * Chart.js paints on a canvas and cannot read CSS custom properties, yet the design
 * system forbids raw hex in app components. Resolve it at runtime instead: map each
 * model to the palette CSS var (from theme/palette.ts, the single source of truth)
 * and read its live value. This keeps chart color in sync with the theme (light/dark)
 * with no duplicated hex. See ADR 008 and app/components/CLAUDE.md.
 */
const ModelChartColorVar: Record<ModelName, string> = {
    income: '--text-success',
    expense: '--text-error',
    debt: '--text-error',
    cash_reserve: '--text-info',
    brokerage: '--text-info',
    tax_deferred: '--text-info',
    ira: '--text-info',
    roth_ira: '--text-info',
    hsa: '--text-info',
}

const INACTIVE_RGB = '136, 136, 136'

/** Live `rgb(...)` for a model's chart series; greys out when inactive. */
export function resolveModelRgb(modelName: ModelName, active = true): string {
    if (!active) return `rgb(${INACTIVE_RGB})`
    if (import.meta.client) {
        const triplet = getComputedStyle(document.documentElement)
            .getPropertyValue(ModelChartColorVar[modelName]).trim()
        if (triplet) return `rgb(${triplet})`
    }
    return `rgb(${INACTIVE_RGB})`
}
