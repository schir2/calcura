<script setup lang="ts">
// Expense projection readout (#115). Plain-language: what this expense costs per
// year, how inflation grows it over the plan, and how retirement changes it
// (is_retirement_only / retirement_spending_percentage). Fed by live preview states.
import type {ModelName} from '#shared/types/ModelName'
import type {ExpenseState} from '#shared/types/ExpenseState'
import type {BaseState} from '#shared/types/BaseState'

const {states, modelName, planAge, baselineStates, retirementIndex} = defineProps<{
  states: BaseState[]
  modelName: ModelName
  planAge?: number
  baselineStates?: BaseState[]
  retirementIndex?: number | null
}>()

const rows = computed(() => states as ExpenseState[])
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
const series = computed(() =>
    rows.value.map(s => s.amount_requested ?? s.amount_paid ?? s.base_amount ?? 0)
)
const baselineSeries = computed(() =>
    ((baselineStates ?? []) as ExpenseState[]).map(s => s.amount_requested ?? s.amount_paid ?? s.base_amount ?? 0)
)
const hasData = computed(() => series.value.length >= 2)

const delta = useAtRetirementDelta({
  edited: series,
  baseline: baselineSeries,
  retirementIndex: computed(() => retirementIndex),
  goodDirection: 'down',
})

const first = computed(() => series.value.find(v => v > 0) ?? series.value[0] ?? 0)
const last = computed(() => series.value[series.value.length - 1] ?? 0)
const peak = computed(() => (series.value.length ? Math.max(...series.value) : 0))
const lifetime = computed(() => series.value.reduce((sum, v) => sum + v, 0))
const growthPct = computed(() =>
    first.value ? Math.round(((last.value - first.value) / first.value) * 100) : 0
)

const currentYear = new Date().getFullYear()
const startIndex = computed(() => series.value.findIndex(v => v > 0))
const startsLater = computed(() => startIndex.value > 0)
const startYear = computed(() =>
    startIndex.value > 0 ? currentYear + startIndex.value : null
)
const startAge = computed(() =>
    startIndex.value > 0 && planAge != null ? planAge + startIndex.value : null
)
const startLabel = computed(() => {
  if (!startsLater.value) return null
  return startAge.value != null
      ? `Begins at age ${startAge.value} (${startYear.value})`
      : `Begins in ${startYear.value}`
})
</script>

<template>
  <div v-if="hasData" class="space-y-4">
    <div>
      <div class="text-[11px] text-skin-muted uppercase tracking-wide">Costs you</div>
      <div class="text-3xl font-semibold tabular-nums text-skin-error leading-tight">
        {{ money(first) }}<span class="text-base text-skin-muted font-normal">/yr</span>
      </div>
      <div class="text-xs text-skin-muted">
        {{ money(lifetime) }} total over the plan
      </div>
    </div>

    <div class="space-y-1">
      <div class="flex justify-between text-[11px]">
        <span class="text-skin-muted">Today {{ money(first) }}</span>
        <span class="text-skin-base">At retirement {{ money(last) }}</span>
      </div>
      <div class="text-xs text-skin-muted">
        <template v-if="growthPct > 0">Grows {{ growthPct }}% over time with inflation</template>
        <template v-else-if="growthPct < 0">Eases {{ Math.abs(growthPct) }}% by retirement</template>
        <template v-else>Holds steady over the plan</template>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <n-tag v-if="startLabel" type="warning" size="small" round>{{ startLabel }}</n-tag>
      <n-tag v-else type="error" size="small" round>Peaks at {{ money(peak) }}/yr</n-tag>
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
