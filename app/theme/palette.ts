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

/** Wrap a triplet/quad token value as a literal CSS color for NaiveUI (seemly-safe). */
function toColor(value: string): string {
    return value.split(',').length === 4 ? `rgba(${value})` : `rgb(${value})`
}

/** Emit the CSS custom properties for both modes (consumed by Tailwind skin tokens). */
export function buildThemeCss(): string {
    const toVars = (tokens: ColorTokens) =>
        Object.entries(tokens).map(([name, value]) => `--${name}:${value};`).join('')
    return `:root{${toVars(lightColorTokens)}}html.dark{${toVars(darkColorTokens)}}`
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
    }
}
