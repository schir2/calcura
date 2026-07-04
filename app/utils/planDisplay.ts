
export function compactMoney(value: number | null | undefined): string {
    if (value == null) return '—'
    const abs = Math.abs(value)
    if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `$${Math.round(value / 1_000)}K`
    return `$${Math.round(value)}`
}

export function asPercent(rate: number | null | undefined): string {
    if (rate == null) return '—'
    return `${Math.round(rate > 1 ? rate : rate * 100)}%`
}

export function headlineGoal(plan: { retirement_income_goal?: number | null; retirement_savings_amount?: number | null }): number | null {
    return plan.retirement_income_goal ?? plan.retirement_savings_amount ?? null
}

export const STRATEGY_LABELS: Record<string, string> = {
    age: 'Retire at a target age',
    debt_free: 'Retire when debt-free',
    percent_rule: 'Retire on the percent rule',
    target_savings: 'Retire at a savings target',
}

export function strategyLabel(strategy: string | null | undefined): string {
    if (!strategy) return 'No strategy set'
    return STRATEGY_LABELS[strategy] ?? strategy
}

export const DOMAIN_TEXT = {
    income: 'text-skin-primary',
    investment: 'text-skin-info',
    expense: 'text-skin-warning',
    debt: 'text-skin-error',
} as const