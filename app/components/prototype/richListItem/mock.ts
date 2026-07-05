// PROTOTYPE — throwaway. Mock stand-in for per-entity Manager State History.
// Delete when the Rich List Item redesign is folded into the real components.
import type {IconName} from "~/components/base/Ico.vue";

export type MockModelName =
    | 'income' | 'expense' | 'debt' | 'cash_reserve' | 'brokerage' | 'roth_ira'

export type MockFacet = { label: string, icon?: IconName }

export type MockItem = {
  id: number
  modelName: MockModelName
  icon: IconName
  name: string
  is_active: boolean
  /** primary strategy facet shown even when collapsed */
  strategy: MockFacet
  /** full facet set, shown expanded */
  facets: MockFacet[]
  headlineValue: number
  headlineLabel: string
  /** '-' outflow, '+' asset, '' neutral */
  sign: '-' | '+' | ''
  /** per-year series standing in for manager.getStates() */
  series: number[]
  /** literal hex for Chart.js (can't read CSS vars); approximates the skin role */
  hex: string
  /** skin text token for SVG sparkline (stroke=currentColor) */
  tone: string
}

function compound(start: number, ratePct: number, years: number, annualAdd = 0): number[] {
  const out: number[] = []
  let bal = start
  for (let year = 0; year < years; year++) {
    bal = bal * (1 + ratePct / 100) + annualAdd
    out.push(Math.round(bal))
  }
  return out
}

function grow(start: number, ratePct: number, years: number): number[] {
  return Array.from({length: years}, (_, year) => Math.round(start * (1 + ratePct / 100) ** year))
}

function payoff(start: number, years: number, paidOffBy: number): number[] {
  return Array.from({length: years}, (_, year) => {
    const remaining = start * (1 - year / paidOffBy)
    return Math.max(0, Math.round(remaining))
  })
}

function reserve(target: number, years: number, fundedBy: number): number[] {
  return Array.from({length: years}, (_, year) => Math.round(target * Math.min(1, year / fundedBy)))
}

const YEARS = 26

export const mockItems: MockItem[] = [
  {
    id: 1, modelName: 'income', icon: 'income', name: 'Software Salary', is_active: true,
    strategy: {label: 'Grows 3%/yr', icon: 'growthRate'},
    facets: [{label: 'Grows 3%/yr', icon: 'growthRate'}, {label: 'Taxable'}],
    headlineValue: 85_000, headlineLabel: 'gross / yr', sign: '+',
    series: grow(85_000, 3, YEARS), hex: '#63e2b7', tone: 'text-skin-success',
  },
  {
    id: 2, modelName: 'expense', icon: 'expense', name: 'Living Costs', is_active: true,
    strategy: {label: 'Essential', icon: 'essential'},
    facets: [{label: 'Essential', icon: 'essential'}, {label: '100% in retirement'}],
    headlineValue: 42_000, headlineLabel: '/ yr', sign: '-',
    series: grow(42_000, 2.5, YEARS), hex: '#e88080', tone: 'text-skin-error',
  },
  {
    id: 3, modelName: 'debt', icon: 'debt', name: 'Mortgage', is_active: true,
    strategy: {label: 'Fixed payment', icon: 'fixed'},
    facets: [{label: 'Fixed payment', icon: 'fixed'}, {label: '4.1% interest', icon: 'interest'}],
    headlineValue: 220_000, headlineLabel: 'payoff 2042', sign: '-',
    series: payoff(220_000, YEARS, 18), hex: '#e88080', tone: 'text-skin-error',
  },
  {
    id: 4, modelName: 'cash_reserve', icon: 'cashReserve', name: 'Emergency Fund', is_active: true,
    strategy: {label: 'Variable', icon: 'variable'},
    facets: [{label: 'Variable', icon: 'variable'}, {label: '6 months target'}],
    headlineValue: 30_000, headlineLabel: 'target reserve', sign: '',
    series: reserve(30_000, YEARS, 5), hex: '#70c0e8', tone: 'text-skin-info',
  },
  {
    id: 5, modelName: 'brokerage', icon: 'brokerage', name: 'Taxable Brokerage', is_active: true,
    strategy: {label: '10% of income', icon: 'growthRate'},
    facets: [{label: '10% of income'}, {label: 'Growth 7%', icon: 'growthRate'}],
    headlineValue: 0, headlineLabel: 'at retirement', sign: '+',
    series: compound(12_000, 7, YEARS, 9_000), hex: '#70c0e8', tone: 'text-skin-info',
  },
  {
    id: 6, modelName: 'roth_ira', icon: 'rothIra', name: 'Roth IRA', is_active: false,
    strategy: {label: 'Maxing out', icon: 'fixed'},
    facets: [{label: 'Maxing out'}, {label: 'Growth 7%', icon: 'growthRate'}, {label: 'Tax-free'}],
    headlineValue: 0, headlineLabel: 'at retirement', sign: '+',
    series: compound(6_000, 7, YEARS, 7_000), hex: '#70c0e8', tone: 'text-skin-info',
  },
]

// investment headline = projected balance at retirement (last series point)
for (const item of mockItems) {
  if (item.headlineLabel === 'at retirement') item.headlineValue = item.series[item.series.length - 1]!
}

export function fmtCurrency(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US')
}
