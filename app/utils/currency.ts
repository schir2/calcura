export const fmtUsd = (value: number): string =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value ?? 0)

export const fmtUsdCompact = (value: number): string =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1}).format(value ?? 0)