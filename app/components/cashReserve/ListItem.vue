<script setup lang="ts">
import type {CashReserve, CashReserveUpdate} from "#shared/types/CashReserve";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {CashReserveState} from "#shared/types/CashReserveState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  cashReserve: CashReserve
  isActive?: boolean
  expanded?: boolean
}
const {cashReserve, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: CashReserveUpdate]
  delete: [id: number]
  toggle: []
}>()

const workspace = useWorkspaceStore()
const tone = 'text-skin-info'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')
const humanize = (value: string) =>
    value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const cashReserveStates = computed<CashReserveState[]>(
    () => (managerStates?.value?.cash_reserve?.[cashReserve.id] as CashReserveState[]) ?? []
)

const series = computed<number[]>(() => {
  const points = cashReserveStates.value.map(
      state => state.cash_reserve_end_of_year ?? state.cash_reserve_start_of_year ?? 0
  )
  return points.length ? points : [cashReserve.initial_amount ?? 0]
})

const headlineValue = computed(
    () => cashReserve.reserve_amount ?? series.value[series.value.length - 1] ?? 0
)

const strategyFacet = computed<RichFacet | null>(() =>
    cashReserve.cash_reserve_strategy
        ? {label: humanize(cashReserve.cash_reserve_strategy), icon: 'fixed'}
        : null
)

const facets = computed<RichFacet[]>(() => {
  const list: RichFacet[] = []
  if (strategyFacet.value) list.push(strategyFacet.value)
  if (cashReserve.reserve_months) list.push({label: `${cashReserve.reserve_months} months target`})
  return list
})
</script>

<template>
  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="workspace.open('cash_reserve', cashReserve.id)"
      @delete="emit('delete', cashReserve.id)"
  >
    <template #icon>
      <base-ico name="cashReserve" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ cashReserve.name }}</span>
    </template>
    <template v-if="strategyFacet" #strategy>
      <base-ico v-if="strategyFacet.icon" :name="strategyFacet.icon"/>
      {{ strategyFacet.label }}
    </template>
    <template #sparkline>
      <base-sparkline :series="series" :active="isActive" :tone="tone"/>
    </template>
    <template #headline>
      <div class="tabular-nums font-semibold" :class="tone">{{ money(headlineValue) }}</div>
      <div class="text-eyebrow text-skin-muted">target reserve</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="cash_reserve" :active="isActive"/>
    </template>
    <template #aside>
      <div class="flex flex-col gap-3 text-xs">
        <div>
          <span class="text-eyebrow text-skin-muted">Projection</span>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">Today</span>
            <span class="tabular-nums font-semibold" :class="tone">{{ money(series[0] ?? 0) }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">target reserve</span>
            <span class="tabular-nums font-semibold" :class="tone">{{ money(headlineValue) }}</span>
          </div>
        </div>
        <div>
          <span class="text-eyebrow text-skin-muted">Configuration</span>
          <div v-for="facet in facets" :key="facet.label" class="flex items-center gap-1.5 mt-1 text-skin-base">
            <base-ico v-if="facet.icon" :name="facet.icon" :class="tone"/>
            {{ facet.label }}
          </div>
        </div>
        <span class="mt-auto flex items-center gap-1 text-skin-info/70 cursor-not-allowed">
          <base-ico name="info"/> What is a cash reserve? <span class="text-eyebrow">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
