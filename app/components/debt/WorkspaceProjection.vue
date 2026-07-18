<script setup lang="ts">
// Debt projection readout (#114). Plain-language, lifespan-aware: when the debt
// is paid off (year / age), what interest it costs along the way, and the
// paydown-to-zero curve. Fed by the live what-if preview states. Color carries
// the signal: green = paid off, red = never pays off.
import type {ModelName} from '#shared/types/ModelName'
import type {DebtState} from '#shared/types/DebtState'
import type {BaseState} from '#shared/types/BaseState'

const {states, modelName, planAge, baselineStates, retirementIndex} = defineProps<{
  states: BaseState[]
  modelName: ModelName
  planAge?: number
  baselineStates?: BaseState[]
  retirementIndex?: number | null
}>()

const rows = computed(() => states as DebtState[])
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
const series = computed(() =>
    rows.value.map(s => s.principal_end_of_year ?? s.principal_start_of_year ?? 0)
)
const baselineSeries = computed(() =>
    ((baselineStates ?? []) as DebtState[]).map(s => s.principal_end_of_year ?? s.principal_start_of_year ?? 0)
)
const hasData = computed(() => series.value.length >= 2)

const delta = useAtRetirementDelta({
  edited: series,
  baseline: baselineSeries,
  retirementIndex: computed(() => retirementIndex),
  goodDirection: 'down',
})

const last = computed(() => rows.value[rows.value.length - 1])
const interestPaid = computed(() => Math.max(0, last.value?.interest_lifetime ?? 0))

const currentYear = new Date().getFullYear()
const payoffIndex = computed(() => series.value.findIndex(v => v <= 0))
const paidOff = computed(() => payoffIndex.value !== -1)
const payoffYear = computed(() => (paidOff.value ? currentYear + payoffIndex.value : null))
const payoffAge = computed(() =>
    paidOff.value && planAge != null ? planAge + payoffIndex.value : null
)
const payoffLabel = computed(() => {
  if (!paidOff.value) return null
  return payoffAge.value != null
      ? `Paid off at age ${payoffAge.value} (${payoffYear.value})`
      : `Paid off in ${payoffYear.value}`
})
</script>

<template>
  <div v-if="hasData" class="space-y-4">
    <div>
      <div class="text-eyebrow text-skin-muted">Interest you'll pay</div>
      <div class="text-metric text-skin-base">{{ money(interestPaid) }}</div>
      <div class="text-xs text-skin-muted">on top of what you borrowed</div>
    </div>

    <div class="flex flex-wrap gap-2">
      <n-tag v-if="payoffLabel" type="success" size="small" round>{{ payoffLabel }}</n-tag>
      <n-tag v-else type="error" size="small" round>Never pays off at this rate</n-tag>
      <n-tag v-if="delta.show.value" :type="delta.type.value" size="small" round>{{ delta.label.value }}</n-tag>
    </div>

    <common-rich-list-item-chart :series="series" :baseline-series="delta.show.value ? baselineSeries : undefined" :model-name="modelName"/>
  </div>
  <div
      v-else
      class="h-40 grid place-items-center rounded border border-dashed border-skin-base text-sm text-skin-muted"
  >
    Enter values to preview this projection
  </div>
</template>
