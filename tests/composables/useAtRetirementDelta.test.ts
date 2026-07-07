import {describe, it, expect} from 'vitest'
import {ref} from 'vue'
import {useAtRetirementDelta} from '~/composables/useAtRetirementDelta'

// series indices: 0..4 (5 simulated years); retirement at index 2 unless noted.
describe('useAtRetirementDelta', () => {
    it('measures the delta at the edited retirement year, not the series end', () => {
        const {delta, label, usedFallback} = useAtRetirementDelta({
            edited: ref([100, 200, 300, 400, 500]),
            baseline: ref([100, 150, 200, 250, 300]),
            retirementIndex: ref(2),
            goodDirection: 'up',
        })
        expect(delta.value).toBe(100) // 300 (edited@2) - 200 (baseline@2)
        expect(usedFallback.value).toBe(false)
        expect(label.value).toBe('+$100 at retirement')
    })

    it('treats an increase as a benefit when good direction is up (asset/income)', () => {
        const {type, isBenefit} = useAtRetirementDelta({
            edited: ref([0, 0, 500]),
            baseline: ref([0, 0, 300]),
            retirementIndex: ref(2),
            goodDirection: 'up',
        })
        expect(isBenefit.value).toBe(true)
        expect(type.value).toBe('success')
    })

    it('treats a decrease as a benefit when good direction is down (debt/expense)', () => {
        const {type, isBenefit, label} = useAtRetirementDelta({
            edited: ref([0, 0, 200]),
            baseline: ref([0, 0, 500]),
            retirementIndex: ref(2),
            goodDirection: 'down',
        })
        expect(isBenefit.value).toBe(true)
        expect(type.value).toBe('success')
        expect(label.value).toBe('−$300 at retirement')
    })

    it('falls back to the final year and relabels when the edited plan never retires', () => {
        const {delta, usedFallback, label} = useAtRetirementDelta({
            edited: ref([100, 200, 900]),
            baseline: ref([100, 200, 600]),
            retirementIndex: ref(null),
            goodDirection: 'up',
        })
        expect(delta.value).toBe(300) // measured at final index 2
        expect(usedFallback.value).toBe(true)
        expect(label.value).toBe('+$300 by end of plan')
    })

    it('hides the tag when there is no baseline (create mode)', () => {
        const {show} = useAtRetirementDelta({
            edited: ref([100, 200, 300]),
            baseline: ref([]),
            retirementIndex: ref(2),
            goodDirection: 'up',
        })
        expect(show.value).toBe(false)
    })

    it('hides the tag when the change is negligible', () => {
        const {show} = useAtRetirementDelta({
            edited: ref([100, 200, 300]),
            baseline: ref([100, 200, 300]),
            retirementIndex: ref(2),
            goodDirection: 'up',
        })
        expect(show.value).toBe(false)
    })
})
