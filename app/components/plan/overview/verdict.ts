// Strategy-aware verdict view-model for the Overview hero (#97).
// Derives an honest headline + four KPIs from the simulation, adapting to the plan's active
// retirement_strategy. Failure state names the dollar gap + nearest lever.
// NOTE: the "money runs out at age N" drawdown claim is intentionally NOT produced here — it is
// gated on the decumulation engine (#79). Only accumulation-derived figures are asserted.
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {PlanWithRelations, RetirementStrategy} from '#shared/types/Plan'
import {fmtUsdCompact} from '~/utils/currency'
import {netWorthAt} from './stats'

export type VerdictTone = 'base' | 'success' | 'error' | 'info'

export interface VerdictKpi {
  label: string
  value: string
  hint?: string
  tone?: VerdictTone
}

export interface Verdict {
  strategy: RetirementStrategy
  onTrack: boolean
  headline: string
  kpis: VerdictKpi[]
  failure?: { gap: string; lever: string }
  spinePeak: string
}

const compact = fmtUsdCompact
const age = (n?: number) => (n != null ? String(n) : '—')

export function buildVerdict(states: OrchestratorState[], plan: PlanWithRelations): Verdict {
  const strategy = plan.retirement_strategy
  const first = states[0]
  const last = states[states.length - 1]
  const retireState = states.find(s => s.retired)
  const onTrack = !!retireState
  const anchor = retireState ?? last

  const startAge = first?.plan.age ?? 0
  const retireAge = retireState?.plan.age
  const yearsToRetire = retireAge != null ? retireAge - startAge : undefined
  const netWorthAtRetirement = anchor ? netWorthAt(anchor) : 0
  const finalNetWorth = last ? netWorthAt(last) : 0
  const peakNetWorth = states.reduce((max, s) => Math.max(max, netWorthAt(s)), 0)

  const debtCleared = states.find(
    s => s.liabilities.debt.balance_end <= 0 && s.liabilities.debt.paid_lifetime > 0)
  const debtFreeAge = debtCleared?.plan.age

  const projectedIncome = anchor?.plan.retirement_income_projected ?? 0
  const goalIncome = anchor?.plan.retirement_income_goal ?? 0
  const coveragePct = goalIncome > 0 ? Math.round((projectedIncome / goalIncome) * 100) : 0

  const totalInterest = last?.liabilities.debt.interest_accrued_lifetime ?? 0
  const totalShortfall = (last?.liabilities.expense.shortfall_lifetime ?? 0) +
    (last?.liabilities.debt.shortfall_lifetime ?? 0)

  const savingsTarget = plan.retirement_savings_amount ?? 0
  const targetHitState = savingsTarget > 0
    ? states.find(s => netWorthAt(s) >= savingsTarget)
    : undefined
  const targetHitAge = targetHitState?.plan.age ?? retireAge
  const surplusOverTarget = netWorthAtRetirement - savingsTarget

  const netWorthKpi: VerdictKpi = {label: 'Net worth at retirement', value: compact(netWorthAtRetirement)}
  const debtFreeKpi: VerdictKpi = {label: 'Debt-free age', value: age(debtFreeAge)}

  const KPIS: Record<RetirementStrategy, VerdictKpi[]> = {
    age: [
      {label: 'Retirement age', value: age(retireAge), hint: yearsToRetire != null ? `in ${yearsToRetire} yrs` : undefined},
      netWorthKpi,
      {label: 'Retirement income', value: `${compact(projectedIncome)}/yr`},
      debtFreeKpi,
    ],
    percent_rule: [
      {label: 'Projected income', value: `${compact(projectedIncome)}/yr`, hint: `goal ${compact(goalIncome)}`},
      {label: 'Goal coverage', value: `${coveragePct}%`, tone: coveragePct >= 100 ? 'success' : 'error'},
      netWorthKpi,
      debtFreeKpi,
    ],
    target_savings: [
      {label: 'Target hit', value: targetHitState ? `age ${targetHitAge}` : '—'},
      {label: 'Saved', value: compact(netWorthAtRetirement), hint: onTrack ? 'target met' : undefined, tone: onTrack ? 'success' : undefined},
      {label: 'Surplus over target', value: `${surplusOverTarget >= 0 ? '+' : ''}${compact(surplusOverTarget)}`},
      debtFreeKpi,
    ],
    debt_free: [
      {label: 'Debt-free age', value: age(debtFreeAge), tone: debtFreeAge != null ? 'success' : 'error'},
      {label: 'Retirement age', value: age(retireAge)},
      netWorthKpi,
      {label: 'Interest paid', value: compact(totalInterest), tone: 'error'},
    ],
  }

  const HEADLINES: Record<RetirementStrategy, { ok: string; fail: string }> = {
    age: {
      ok: `Retire at ${age(retireAge)}.`,
      fail: `You can't retire at ${plan.retirement_age} — yet.`,
    },
    percent_rule: {
      ok: `Your income covers your goal at ${age(retireAge)}.`,
      fail: 'Your income falls short of your goal.',
    },
    target_savings: {
      ok: `You hit ${compact(savingsTarget)} at ${age(targetHitAge)}.`,
      fail: `You never reach your ${compact(savingsTarget)} target.`,
    },
    debt_free: {
      ok: `Debt-free at ${age(debtFreeAge)}, retire at ${age(retireAge)}.`,
      fail: 'Debt outlives the plan.',
    },
  }

  const gapByStrategy: Record<RetirementStrategy, string> = {
    age: compact(totalShortfall),
    debt_free: compact(totalShortfall),
    percent_rule: `${compact(Math.max(0, goalIncome - projectedIncome))}/yr`,
    target_savings: compact(Math.max(0, savingsTarget - finalNetWorth)),
  }

  return {
    strategy,
    onTrack,
    headline: onTrack ? HEADLINES[strategy].ok : HEADLINES[strategy].fail,
    kpis: KPIS[strategy],
    failure: onTrack ? undefined : {
      gap: gapByStrategy[strategy],
      lever: 'Close the gap by retiring later, trimming spending, or saving more each year.',
    },
    spinePeak: compact(peakNetWorth),
  }
}
