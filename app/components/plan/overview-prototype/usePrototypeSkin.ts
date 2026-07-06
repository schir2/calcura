// PROTOTYPE — issue #94 Overview chart composition. Throwaway; delete with the folder.
//
// Two color sources:
//  - skin(token)  → axis / grid / text, read live from palette.ts CSS vars (light/dark safe).
//  - hue(name)    → saturated DATA-SERIES colors matching the approved master prototype
//                   (artifact cb56a0f0). These extend beyond the app skin tokens — the master
//                   introduces violet + teal for series that palette.ts has no token for.
//                   On fold-in, #94 should add real chart-series tokens to palette.ts.
//
// Reactive to the app's Naive color mode: `colorMode.value` is touched so chart computeds
// recompute after the `html.dark` class flips.

const SERIES: Record<'light' | 'dark', Record<string, string>> = {
  // rgb triples so callers can add alpha
  light: {
    blue: '32, 128, 240', green: '24, 160, 88', violet: '124, 108, 240',
    amber: '240, 160, 32', teal: '15, 148, 136', red: '208, 48, 80',
    slate: '118, 124, 130', ink: '11, 13, 15',
  },
  dark: {
    blue: '112, 192, 232', green: '99, 226, 183', violet: '168, 156, 245',
    amber: '242, 201, 125', teal: '94, 202, 181', red: '232, 128, 128',
    slate: '154, 160, 166', ink: '235, 235, 235',
  },
}

// Neutral chart text/grid colors as light/dark LITERALS (from palette.ts values). Canvas paints
// once per render and can't read CSS vars reactively — reading them via getComputedStyle races the
// `html.dark` class flip and lags a toggle behind. Selecting literals off colorMode is race-free.
const NEUTRAL: Record<'light' | 'dark', Record<string, string>> = {
  light: {label: '51, 54, 57', muted: '118, 124, 130', grid: '224, 224, 230'},
  dark: {label: '209, 209, 209', muted: '150, 150, 150', grid: '84, 84, 84'},
}

// Asset category / entity → series hue, matching the master prototype's legend.
export const CATEGORY_HUE: Record<string, keyof typeof SERIES['light']> = {
  tax_deferred: 'blue',
  taxable: 'green',
  tax_exempt: 'violet',
  cash_reserve: 'amber',
  cash: 'teal',
}

export function usePrototypeSkin() {
  const {colorMode} = useNaiveColorMode()

  function triple(token: string): string {
    if (typeof window === 'undefined') return '0, 0, 0'
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim()
    return value || '0, 0, 0'
  }

  function skin(token: string, alpha = 1): string {
    void colorMode.value
    return alpha >= 1 ? `rgb(${triple(token)})` : `rgba(${triple(token)}, ${alpha})`
  }

  function hue(name: keyof typeof SERIES['light'], alpha = 1): string {
    const mode = colorMode.value === 'dark' ? 'dark' : 'light'
    const rgb = SERIES[mode][name] ?? SERIES[mode].slate
    return alpha >= 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`
  }

  function ink(role: 'label' | 'muted' | 'grid', alpha = 1): string {
    const mode = colorMode.value === 'dark' ? 'dark' : 'light'
    const rgb = NEUTRAL[mode][role] ?? NEUTRAL[mode].muted
    return alpha >= 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`
  }

  return {skin, hue, ink, colorMode}
}

export const fmtUsd = (value: number): string =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value ?? 0)

export const fmtUsdCompact = (value: number): string =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1}).format(value ?? 0)
