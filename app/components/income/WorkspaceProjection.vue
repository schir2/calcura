<script setup lang="ts">
// Income projection readout (#101). Income is a flow, not an account — plain
// language: what it pays now, what it grows to, and total lifetime earnings.
// Fed by the live what-if preview states (IncomeState.gross_income per year).
import type {ModelName} from '#shared/types/ModelName'
import type {IncomeState} from '#shared/types/IncomeState'
import type {BaseState} from '#shared/types/BaseState'

const {states, modelName, baselineStates, retirementIndex} = defineProps<{
  states: BaseState[]
  modelName: ModelName
  planAge?: number
  baselineStates?: BaseState[]
  retirementIndex?: number | null
}>()

const rows = computed(() => states as IncomeState[])
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
const series = computed(() => rows.value.map(s => s.gross_income ?? 0))
const baselineSeries = computed(() =>
    ((baselineStates ?? []) as IncomeState[]).map(s => s.gross_income ?? 0)
)
const hasData = computed(() => series.value.length >= 2)

const delta = useAtRetirementDelta({
  edited: series,
  baseline: baselineSeries,
  retirementIndex: computed(() => retirementIndex),
  goodDirection: 'up',
})

const today = computed(() => series.value[0] ?? 0)
const end = computed(() => series.value[series.value.length - 1] ?? 0)
const lifetime = computed(() => series.value.reduce((sum, v) => sum + v, 0))
</script>

<template>
  <div v-if="hasData" class="space-y-4">
    <div>
      <div class="text-[11px] text-skin-muted uppercase tracking-wide">Lifetime earnings</div>
      <div class="text-3xl font-semibold tabular-nums text-skin-base leading-tight">{{ money(lifetime) }}</div>
      <div class="text-xs text-skin-muted">before you stop working</div>
    </div>

    <div class="flex flex-wrap gap-2">
      <n-tag size="small" round>{{ money(today) }}/yr today</n-tag>
      <n-tag size="small" round type="success">grows to {{ money(end) }}/yr</n-tag>
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
