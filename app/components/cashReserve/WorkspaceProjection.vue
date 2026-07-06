<script setup lang="ts">
// Cash reserve projection readout (#120). A cash reserve is a buffer: it fills
// to a target and then holds flat — it never grows or runs out. So the readout
// is the buffer it holds (the series plateau) and, when unambiguous, the year
// the buffer first reaches that plateau. Fed by the live what-if preview states.
import type {ModelName} from '#shared/types/ModelName'
import type {CashReserveState} from '#shared/types/CashReserveState'
import type {BaseState} from '#shared/types/BaseState'

const {states, modelName, planAge} = defineProps<{
  states: BaseState[]
  modelName: ModelName
  planAge?: number
}>()

const rows = computed(() => states as CashReserveState[])
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
const series = computed(() =>
    rows.value.map(s => s.cash_reserve_end_of_year ?? s.cash_reserve_start_of_year ?? 0)
)
const hasData = computed(() => series.value.length >= 2)

const bufferLevel = computed(() => series.value[series.value.length - 1] ?? 0)

const currentYear = new Date().getFullYear()
// First year the buffer reaches its plateau (stops increasing). Ambiguous when the
// buffer is still climbing at the end of the horizon — then we show no funded tag.
const stillClimbing = computed(() => {
  const values = series.value
  return values.length >= 2 && (values[values.length - 1] ?? 0) > (values[values.length - 2] ?? 0)
})
const fundedIndex = computed(() => {
  const values = series.value
  const target = bufferLevel.value
  if (!values.length || stillClimbing.value) return -1
  return values.findIndex(v => v >= target)
})
const fundedLabel = computed(() => {
  if (fundedIndex.value < 0) return null
  const year = currentYear + fundedIndex.value
  return planAge != null
      ? `Funded by age ${planAge + fundedIndex.value} (${year})`
      : `Funded by ${year}`
})
</script>

<template>
  <div v-if="hasData" class="space-y-4">
    <div>
      <div class="text-[11px] text-skin-muted uppercase tracking-wide">Cash buffer</div>
      <div class="text-3xl font-semibold tabular-nums text-skin-base leading-tight">{{ money(bufferLevel) }}</div>
      <div class="text-xs text-skin-muted">your safety net, held in reserve</div>
    </div>

    <div v-if="fundedLabel">
      <n-tag type="success" size="small" round>{{ fundedLabel }}</n-tag>
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
