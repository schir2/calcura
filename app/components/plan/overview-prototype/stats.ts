// PROTOTYPE — issue #94. Summary numbers derived from the simulation for the stat tiles / verdict.
import type {OrchestratorState} from '#shared/types/OrchestratorState'

const ASSET_KEYS = ['tax_deferred', 'taxable', 'tax_exempt', 'cash_reserve'] as const

export function netWorthAt(s: OrchestratorState): number {
  return s.assets.tax_deferred.balance_end + s.assets.taxable.balance_end +
    s.assets.tax_exempt.balance_end + s.assets.cash_reserve.balance_end +
    s.cash.net - s.liabilities.debt.balance_end
}

export function overviewStats(states: OrchestratorState[]) {
  const first = states[0]
  const last = states[states.length - 1]
  const retireIndex = states.findIndex(s => s.retired)
  const retireState = retireIndex >= 0 ? states[retireIndex] : undefined
  const onTrack = retireIndex >= 0

  const shortfallStates = states.filter(
    s => s.liabilities.expense.shortfall > 0 || s.liabilities.debt.shortfall > 0)
  const totalShortfall = (last?.liabilities.expense.shortfall_lifetime ?? 0) +
    (last?.liabilities.debt.shortfall_lifetime ?? 0)

  const totalContributions = states.reduce(
    (sum, s) => sum + ASSET_KEYS.reduce((a, k) => a + s.assets[k].contribution, 0), 0)
  const totalGrowth = states.reduce(
    (sum, s) => sum + ASSET_KEYS.reduce((a, k) => {
      const x = s.assets[k]
      return a + (x.balance_end - x.balance_start - x.contribution)
    }, 0), 0)

  return {
    onTrack,
    startAge: first?.plan.age ?? 0,
    retireAge: retireState?.plan.age,
    yearsToRetire: retireState ? retireState.plan.age - (first?.plan.age ?? 0) : undefined,
    netWorthAtRetirement: retireState ? netWorthAt(retireState) : undefined,
    finalNetWorth: last ? netWorthAt(last) : 0,
    peakNetWorth: states.reduce((max, s) => Math.max(max, netWorthAt(s)), 0),
    totalContributions,
    totalGrowth,
    totalInterestPaid: last?.liabilities.debt.interest_accrued_lifetime ?? 0,
    totalShortfall,
    shortfallYears: shortfallStates.length,
    firstShortfallAge: shortfallStates[0]?.plan.age,
    debtRemaining: last?.liabilities.debt.balance_end ?? 0,
    retirementIncomeProjected: retireState?.plan.retirement_income_projected,
    retirementIncomeGoal: retireState?.plan.retirement_income_goal ?? last?.plan.retirement_income_goal,
  }
}
