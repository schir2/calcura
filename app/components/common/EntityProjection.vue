<script setup lang="ts">
// Investment projection readout (#95). Plain-language, lifespan-aware: what it
// grows to, the compounding split (what you put in vs growth), and the honest
// drawdown outcome (lasts vs runs out at age/year). Fed by the live what-if
// preview states. Per-domain readouts (debt/income/expense) are separate.
import type {ModelName} from '#shared/types/ModelName'
import type {InvestmentState} from '#shared/types/InvestmentState'
import type {BaseState} from '#shared/types/BaseState'

const {states, modelName, planAge} = defineProps<{
  states: BaseState[]
  modelName: ModelName
  planAge?: number
}>()

const rows = computed(() => states as InvestmentState[])
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
const series = computed(() => rows.value.map(s => s.balance_end_of_year ?? s.balance_start_of_year ?? 0))
const hasData = computed(() => series.value.length >= 2)

const last = computed(() => rows.value[rows.value.length - 1])
const contributed = computed(() => last.value?.contribution_lifetime ?? 0)
const growth = computed(() => Math.max(0, last.value?.growth_lifetime ?? 0))
const ending = computed(() => last.value?.balance_end_of_year ?? 0)
const peak = computed(() => (series.value.length ? Math.max(...series.value) : 0))
const growthPct = computed(() => (peak.value ? Math.round((growth.value / peak.value) * 100) : 0))
const multiple = computed(() => (contributed.value ? (peak.value / contributed.value).toFixed(1) : '0'))

const currentYear = new Date().getFullYear()
const runOutIndex = computed(() =>
    series.value.findIndex((v, i) => v <= 0 && (series.value[i - 1] ?? 0) > 0)
)
const runOutYear = computed(() => (runOutIndex.value > 0 ? currentYear + runOutIndex.value : null))
const runOutAge = computed(() =>
    runOutIndex.value > 0 && planAge != null ? planAge + runOutIndex.value : null
)
const runOutLabel = computed(() => {
  if (!runOutYear.value) return null
  return runOutAge.value != null
      ? `Runs out at age ${runOutAge.value} (${runOutYear.value})`
      : `Runs out in ${runOutYear.value}`
})
</script>

<template>
  <div v-if="hasData" class="space-y-4">
    <div>
      <div class="text-[11px] text-skin-muted uppercase tracking-wide">Grows to</div>
      <div class="text-3xl font-semibold tabular-nums text-skin-base leading-tight">{{ money(peak) }}</div>
      <div class="text-xs text-skin-muted">{{ multiple }}× what you put in</div>
    </div>

    <div class="space-y-1">
      <n-progress
          type="line"
          :percentage="growthPct"
          :show-indicator="false"
          :height="12"
          rail-color="rgb(var(--bg-info))"
          color="rgb(var(--bg-success))"
      />
      <div class="flex justify-between text-[11px]">
        <span class="text-skin-info">You put in {{ money(contributed) }}</span>
        <span class="text-skin-success">Growth {{ money(growth) }}</span>
      </div>
    </div>

    <div>
      <n-tag v-if="runOutLabel" type="error" size="small" round>{{ runOutLabel }}</n-tag>
      <n-tag v-else type="success" size="small" round>Still funding you at the end — {{ money(ending) }} left</n-tag>
    </div>

    <common-rich-list-item-chart :series="series" :model-name="modelName"/>
  </div>
  <div
      v-else
      class="h-40 grid place-items-center rounded border border-dashed border-skin-base text-sm text-skin-muted"
  >
    Enter values to preview this projection
  </div>
</template>
