/*
 * Single source of truth for the color palette.
 * See docs/design-system.md and ADR 008.
 *
 * Each value is an `R, G, B` (or `R, G, B, A`) string. Two consumers derive from it:
 *   1. CSS custom properties — `buildThemeCss()` emits `:root` (light) + `html.dark`
 *      (dark). Tailwind `skin` tokens read these via withOpacity() in tailwind.config.ts.
 *   2. NaiveUI theme — `buildNaiveCommon()` emits LITERAL `rgb()/rgba()` values, because
 *      NaiveUI runs colors through seemly color-math at runtime and cannot parse var().
 *
 * Edit a value here once and both Tailwind and NaiveUI move together.
 */

export type ColorTokens = Record<string, string>

export const lightColorTokens: ColorTokens = {
    // Surfaces
    'bg-base': '255, 255, 255',
    'bg-surface': '255, 255, 255',
    'bg-surface-hover': '243, 243, 245',
    'bg-muted': '250, 250, 252',
    'bg-overlay': '255, 255, 255, 0.82',
    'bg-hover': '236, 240, 243',
    'bg-primary': '24, 160, 88',
    'bg-secondary': '32, 128, 240',
    'bg-tertiary': '118, 124, 130',
    'bg-accent': '24, 160, 88',
    'bg-error': '208, 48, 80',
    'bg-success': '24, 160, 88',
    'bg-warning': '240, 160, 32',
    'bg-info': '32, 128, 240',

    // Text
    'text-base': '0, 0, 0',
    'text-inverted': '255, 255, 255',
    'text-muted': '118, 124, 130',
    'text-secondary': '51, 54, 57',
    'text-tertiary': '118, 124, 130',
    'text-accent': '24, 160, 88',
    'text-primary': '24, 160, 88',
    'text-primary-hover': '54, 173, 106',
    'text-primary-active': '12, 122, 67',
    'text-info': '32, 128, 240',
    'text-info-hover': '64, 152, 252',
    'text-info-active': '16, 96, 201',
    'text-error': '208, 48, 80',
    'text-error-hover': '222, 87, 109',
    'text-error-active': '171, 31, 63',
    'text-warning': '240, 160, 32',
    'text-warning-hover': '252, 176, 64',
    'text-warning-active': '201, 124, 16',
    'text-success': '24, 160, 88',
    'text-success-hover': '54, 173, 106',
    'text-success-active': '12, 122, 67',
    'text-link': '32, 128, 240',
    'text-link-hover': '64, 152, 252',
    'text-link-active': '16, 96, 201',

    // Borders
    'border-base': '224, 224, 230',
    'border-muted': '239, 239, 245',
    'border-primary': '24, 160, 88',
    'border-secondary': '32, 128, 240',
    'border-tertiary': '118, 124, 130',
    'border-accent': '24, 160, 88',
    'border-error': '208, 48, 80',
    'border-success': '24, 160, 88',
    'border-warning': '240, 160, 32',
    'border-info': '32, 128, 240',

    // Icons
    'icon-base': '0, 0, 0',
    'icon-muted': '118, 124, 130',
    'icon-tertiary': '118, 124, 130',
    'icon-accent': '24, 160, 88',
    'icon-primary': '24, 160, 88',
    'icon-secondary': '32, 128, 240',
    'icon-error': '208, 48, 80',
    'icon-success': '24, 160, 88',
    'icon-warning': '240, 160, 32',
    'icon-info': '32, 128, 240',

    // Alpha helpers
    'alpha-disabled': '0, 0, 0, 0.5',
    'alpha-disabled-input': '0, 0, 0, 0.02',
    'alpha-divider': '0, 0, 0, 0.06',
    'alpha-pressed': '0, 0, 0, 0.07',
    'alpha-scrollbar': '0, 0, 0, 0.25',
    'alpha-scrollbar-hover': '0, 0, 0, 0.4',
    'alpha-overlay': '255, 255, 255, 0.82',
}

export const darkColorTokens: ColorTokens = {
    // Surfaces
    'bg-base': '16, 16, 20',
    'bg-surface': '24, 24, 28',
    'bg-surface-hover': '44, 44, 50',
    'bg-muted': '44, 44, 50',
    'bg-overlay': '72, 72, 78, 0.9',
    'bg-hover': '42, 148, 125',
    'bg-primary': '99, 226, 183',
    'bg-secondary': '112, 192, 232',
    'bg-tertiary': '150, 150, 150',
    'bg-accent': '99, 226, 183',
    'bg-error': '232, 128, 128',
    'bg-success': '99, 226, 183',
    'bg-warning': '242, 201, 125',
    'bg-info': '112, 192, 232',

    // Text
    'text-base': '255, 255, 255',
    'text-inverted': '0, 0, 0',
    'text-muted': '150, 150, 150',
    'text-secondary': '209, 209, 209',
    'text-tertiary': '133, 133, 133',
    'text-accent': '99, 226, 183',
    'text-primary': '99, 226, 183',
    'text-primary-hover': '127, 231, 196',
    'text-primary-active': '90, 206, 167',
    'text-info': '112, 192, 232',
    'text-info-hover': '138, 203, 236',
    'text-info-active': '102, 175, 211',
    'text-error': '232, 128, 128',
    'text-error-hover': '233, 139, 139',
    'text-error-active': '229, 114, 114',
    'text-warning': '242, 201, 125',
    'text-warning-hover': '245, 213, 153',
    'text-warning-active': '230, 194, 96',
    'text-success': '99, 226, 183',
    'text-success-hover': '127, 231, 196',
    'text-success-active': '90, 206, 167',
    'text-link': '112, 192, 232',
    'text-link-hover': '138, 203, 236',
    'text-link-active': '102, 175, 211',

    // Borders
    'border-base': '84, 84, 84',
    'border-muted': '48, 48, 48',
    'border-primary': '99, 226, 183',
    'border-secondary': '112, 192, 232',
    'border-tertiary': '150, 150, 150',
    'border-accent': '99, 226, 183',
    'border-error': '232, 128, 128',
    'border-success': '99, 226, 183',
    'border-warning': '242, 201, 125',
    'border-info': '112, 192, 232',

    // Icons
    'icon-base': '255, 255, 255',
    'icon-muted': '150, 150, 150',
    'icon-tertiary': '150, 150, 150',
    'icon-accent': '99, 226, 183',
    'icon-primary': '99, 226, 183',
    'icon-secondary': '112, 192, 232',
    'icon-error': '232, 128, 128',
    'icon-success': '99, 226, 183',
    'icon-warning': '242, 201, 125',
    'icon-info': '112, 192, 232',

    // Alpha helpers
    'alpha-disabled': '0, 0, 0, 0.38',
    'alpha-disabled-input': '0, 0, 0, 0.06',
    'alpha-divider': '0, 0, 0, 0.09',
    'alpha-pressed': '0, 0, 0, 0.05',
    'alpha-scrollbar': '0, 0, 0, 0.2',
    'alpha-scrollbar-hover': '0, 0, 0, 0.3',
    'alpha-overlay': '10, 10, 10, 0.8',
}

/*
 * Radius + elevation scales. Unlike color, these are not run through NaiveUI's
 * seemly color-math, so they need no light/dark literal split — a single scale
 * emitted into :root suffices. Tailwind reads them via var() in tailwind.config.ts
 * (borderRadius / boxShadow); NaiveUI's common gets the literal radius for parity.
 *
 * Radius seeded from NaiveUI borderRadius (3px) / borderRadiusSmall (2px);
 * elevation seeded from NaiveUI boxShadow1/2/3.
 */
/*
 * Chart-series + neutral colors for Chart.js canvases. A canvas paints once per render and can't
 * read CSS vars reactively, so these are literal rgb triples selected by color mode at draw time
 * (see composables/useChartColors). palette.ts stays the single source of truth for color (ADR 008).
 * violet + teal live only here — the skin token set has no equivalent.
 */
export type ChartHue = 'blue' | 'green' | 'violet' | 'amber' | 'teal' | 'red' | 'slate' | 'ink'

export const chartSeriesLight: Record<ChartHue, string> = {
    blue: '32, 128, 240', green: '24, 160, 88', violet: '124, 108, 240',
    amber: '240, 160, 32', teal: '15, 148, 136', red: '208, 48, 80',
    slate: '118, 124, 130', ink: '11, 13, 15',
}

export const chartSeriesDark: Record<ChartHue, string> = {
    blue: '112, 192, 232', green: '99, 226, 183', violet: '168, 156, 245',
    amber: '242, 201, 125', teal: '94, 202, 181', red: '232, 128, 128',
    slate: '154, 160, 166', ink: '235, 235, 235',
}

export type ChartNeutral = 'label' | 'muted' | 'grid'

export const chartNeutralLight: Record<ChartNeutral, string> = {
    label: '51, 54, 57', muted: '118, 124, 130', grid: '224, 224, 230',
}

export const chartNeutralDark: Record<ChartNeutral, string> = {
    label: '209, 209, 209', muted: '150, 150, 150', grid: '84, 84, 84',
}

// Asset category / entity → chart-series hue.
export const chartCategoryHue = {
    tax_deferred: 'blue', taxable: 'green', tax_exempt: 'violet', cash_reserve: 'amber', cash: 'teal',
} as const satisfies Record<string, ChartHue>

export type ScaleTokens = Record<string, string>

export const radiusTokens: ScaleTokens = {
    'radius-sm': '2px',
    'radius': '3px',
    'radius-lg': '6px',
    'radius-xl': '8px',
    'radius-2xl': '12px',
    'radius-3xl': '16px',
}

export const elevationTokens: ScaleTokens = {
    'elevation-1': '0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)',
    'elevation-2': '0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)',
    'elevation-3': '0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)',
}

/*
 * Type scale — seven semantic roles named for the job the text does, not its size.
 * Like radius and elevation (and unlike color), type is not run through NaiveUI's
 * seemly color-math, so it needs no light/dark split — one scale into :root suffices.
 *
 * Each role bundles size + weight + tracking + leading, so a component picks ONE class
 * (`text-title`) rather than assembling `text-2xl font-semibold tracking-tight`. The
 * `text-<role>` utilities are built from these vars in tailwind.config.ts; `metric` also
 * carries tabular figures and `eyebrow` uppercases — properties Tailwind's `fontSize`
 * theme key cannot express, which is why the roles are utilities, not fontSize entries.
 *
 * See ADR 013 and docs/design-system.md. Never hand-roll text-2xl / font-semibold.
 */
export const typeTokens: ScaleTokens = {
    // Page titles, verdict hero
    'fs-display': '36px', 'fw-display': '700', 'ls-display': '-0.02em', 'lh-display': '1.15',
    // Dialog + card titles
    'fs-title': '24px', 'fw-title': '600', 'ls-title': '-0.01em', 'lh-title': '1.25',
    // Section headers
    'fs-heading': '18px', 'fw-heading': '600', 'ls-heading': '0', 'lh-heading': '1.35',
    // Default copy. NaiveUI is moved up to match this from its 14px default (ADR 013).
    'fs-body': '16px', 'fw-body': '400', 'ls-body': '0', 'lh-body': '1.55',
    // Projection headline values. Tabular figures so money never jitters as it updates.
    'fs-metric': '30px', 'fw-metric': '600', 'ls-metric': '-0.01em', 'lh-metric': '1.2',
    // Helper text, empty states
    'fs-caption': '12px', 'fw-caption': '400', 'ls-caption': '0', 'lh-caption': '1.45',
    // Overlines. Replaces both text-[10px] and text-[11px] — one role, one size.
    'fs-eyebrow': '11px', 'fw-eyebrow': '600', 'ls-eyebrow': '0.08em', 'lh-eyebrow': '1.4',
}

/*
 * The font stack, declared rather than loaded — no webfont, no @font-face, no payload.
 * Naming it is what lets NaiveUI (which otherwise leads with `v-sans`, a face that has no
 * @font-face and never resolves) and Tailwind (`ui-sans-serif`) agree on one stack.
 * Wiring it into both consumers is ADR 013 / issue #139.
 */
export const fontFamilyTokens: ScaleTokens = {
    'font-sans': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
}

/** Wrap a triplet/quad token value as a literal CSS color for NaiveUI (seemly-safe). */
function toColor(value: string): string {
    return value.split(',').length === 4 ? `rgba(${value})` : `rgb(${value})`
}

/** Emit the CSS custom properties (colors for both modes; radius, elevation + type once). */
export function buildThemeCss(): string {
    const toVars = (tokens: Record<string, string>) =>
        Object.entries(tokens).map(([name, value]) => `--${name}:${value};`).join('')
    const scales = toVars(radiusTokens) + toVars(elevationTokens) + toVars(typeTokens) + toVars(fontFamilyTokens)
    return `:root{${toVars(lightColorTokens)}${scales}}html.dark{${toVars(darkColorTokens)}}`
}

/**
 * Map palette tokens to a NaiveUI `common` theme override with LITERAL colors.
 * Variant fields are set explicitly — NaiveUI cannot derive them from a var().
 */
export function buildNaiveCommon(tokens: ColorTokens) {
    return {
        primaryColor: toColor(tokens['text-primary']),
        primaryColorHover: toColor(tokens['text-primary-hover']),
        primaryColorPressed: toColor(tokens['text-primary-active']),
        primaryColorSuppl: toColor(tokens['text-primary-hover']),

        infoColor: toColor(tokens['text-info']),
        infoColorHover: toColor(tokens['text-info-hover']),
        infoColorPressed: toColor(tokens['text-info-active']),
        infoColorSuppl: toColor(tokens['text-info-hover']),

        successColor: toColor(tokens['text-success']),
        successColorHover: toColor(tokens['text-success-hover']),
        successColorPressed: toColor(tokens['text-success-active']),
        successColorSuppl: toColor(tokens['text-success-hover']),

        warningColor: toColor(tokens['text-warning']),
        warningColorHover: toColor(tokens['text-warning-hover']),
        warningColorPressed: toColor(tokens['text-warning-active']),
        warningColorSuppl: toColor(tokens['text-warning-hover']),

        errorColor: toColor(tokens['text-error']),
        errorColorHover: toColor(tokens['text-error-hover']),
        errorColorPressed: toColor(tokens['text-error-active']),
        errorColorSuppl: toColor(tokens['text-error-hover']),

        textColorBase: toColor(tokens['text-base']),
        textColor1: toColor(tokens['text-base']),
        textColor2: toColor(tokens['text-secondary']),
        textColor3: toColor(tokens['text-muted']),

        bodyColor: toColor(tokens['bg-base']),
        cardColor: toColor(tokens['bg-surface']),
        modalColor: toColor(tokens['bg-surface']),
        popoverColor: toColor(tokens['bg-surface']),
        tableColor: toColor(tokens['bg-surface']),

        borderColor: toColor(tokens['border-base']),
        dividerColor: toColor(tokens['border-muted']),

        // Radius parity — keep NaiveUI's internal rounding on the same scale as
        // the Tailwind rounded-* utilities (literal values; var() is not seemly-safe).
        borderRadius: radiusTokens['radius'],
        borderRadiusSmall: radiusTokens['radius-sm'],

        // Type parity (ADR 013). NaiveUI defaults to a 14px base and a `v-sans` stack that
        // has no @font-face and never resolves; Tailwind runs at 16px on ui-sans-serif.
        // Two base sizes and two stacks, with nothing reconciling them. These four keys do.
        //
        // `fontSize` moves general text and ALL n-card content — the card theme derives
        // every one of its size variants from this single key. That is the mismatch ADR 013
        // names: text in an n-card vs. text in a sibling <p>.
        //
        // DELIBERATELY NOT SET: fontSizeMini/Tiny/Small/Medium/Large/Huge. n-button, n-input
        // and n-data-table read only those, so controls and the Report table stay at
        // NaiveUI's 14px — denser than body copy, which is the convention we want and keeps
        // the ~360px Workspace drawer column (see ADR 011) from re-breaking. Raise them only
        // as a deliberate, separately-verified change.
        fontSize: typeTokens['fs-body'],
        fontFamily: fontFamilyTokens['font-sans'],
        fontFamilyMono: fontFamilyTokens['font-mono'],
        // NaiveUI's "strong" is 500; our heading/title roles are 600. This aligns n-card
        // titles and <n-button strong> with the type scale.
        fontWeightStrong: typeTokens['fw-heading'],
    }
}
