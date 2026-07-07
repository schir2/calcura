import type {Ref} from 'vue'

// Baseline-vs-edited "at retirement" delta for the Entity Workspace projection (#107). Reads both
// series at the edited plan's retirement year; falls back to the final year ("by end of plan") when
// the edited plan never retires. Benefit — not raw sign — drives the color: up-is-good for assets
// and income, down-is-good for debt and expense. Hidden when there is no baseline or no real change.
export function useAtRetirementDelta(opts: {
    edited: Ref<number[]>
    baseline: Ref<number[]>
    retirementIndex: Ref<number | null | undefined>
    goodDirection: 'up' | 'down'
}) {
    const CHANGE_THRESHOLD = 1

    const referenceIndex = (length: number) => {
        const index = opts.retirementIndex.value
        return index != null && index >= 0 && index < length ? index : length - 1
    }

    const usedFallback = computed(() => {
        const index = opts.retirementIndex.value
        return !(index != null && index >= 0 && index < opts.edited.value.length)
    })

    const valueAt = (series: number[]) =>
        series.length ? series[referenceIndex(series.length)] ?? null : null

    const delta = computed(() => {
        const editedValue = valueAt(opts.edited.value)
        const baselineValue = valueAt(opts.baseline.value)
        if (editedValue == null || baselineValue == null) return null
        return editedValue - baselineValue
    })

    const show = computed(() =>
        opts.baseline.value.length > 0 && delta.value != null && Math.abs(delta.value) >= CHANGE_THRESHOLD
    )

    const isBenefit = computed(() => {
        if (delta.value == null) return false
        return opts.goodDirection === 'up' ? delta.value > 0 : delta.value < 0
    })

    const type = computed<'success' | 'error'>(() => (isBenefit.value ? 'success' : 'error'))

    const label = computed(() => {
        if (delta.value == null) return ''
        const magnitude = '$' + Math.round(Math.abs(delta.value)).toLocaleString('en-US')
        const when = usedFallback.value ? 'by end of plan' : 'at retirement'
        return `${delta.value >= 0 ? '+' : '−'}${magnitude} ${when}`
    })

    return {show, type, label, delta, isBenefit, usedFallback}
}