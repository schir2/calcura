<script setup lang="ts">
import type {Brokerage, BrokerageUpdate} from "#shared/types/Brokerage";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {BrokerageState} from "#shared/types/BrokerageState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  brokerage: Brokerage
  isActive?: boolean
  expanded?: boolean
}
const {brokerage, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: BrokerageUpdate]
  delete: [id: number]
  toggle: []
}>()

const workspace = useWorkspaceStore()
const tone = 'text-skin-info'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const brokerageStates = computed<BrokerageState[]>(
    () => (managerStates?.value?.brokerage?.[brokerage.id] as BrokerageState[]) ?? []
)

// Per-year balance series; the headline is the last point = projected balance at retirement.
// Edge case (#83): when the plan never reaches retirement the sim still yields an accumulation
// series — the last available point is used, falling back to the initial balance.
const series = computed<number[]>(() => {
  const points = brokerageStates.value.map(
      state => state.balance_end_of_year ?? state.balance_start_of_year ?? 0
  )
  return points.length ? points : [brokerage.initial_balance ?? 0]
})

const headlineValue = computed(() => series.value[series.value.length - 1] ?? 0)

const strategyFacet = computed<RichFacet>(() => {
  switch (brokerage.contribution_strategy) {
    case 'percentage_of_income':
      return {label: `${brokerage.contribution_percentage ?? 0}% of income`, icon: 'growthRate'}
    case 'max':
      return {label: 'Maxing out', icon: 'fixed'}
    default:
      return {label: `${money(brokerage.contribution_fixed_amount ?? 0)}/yr`, icon: 'fixed'}
  }
})

const facets = computed<RichFacet[]>(() => {
  const list: RichFacet[] = [strategyFacet.value]
  if (brokerage.growth_rate) list.push({label: `Growth ${brokerage.growth_rate}%`, icon: 'growthRate'})
  return list
})
</script>

<template>
  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="workspace.open('brokerage', brokerage.id)"
      @delete="emit('delete', brokerage.id)"
  >
    <template #icon>
      <base-ico name="brokerage" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ brokerage.name }}</span>
    </template>
    <template #strategy>
      <base-ico v-if="strategyFacet.icon" :name="strategyFacet.icon"/>
      {{ strategyFacet.label }}
    </template>
    <template #sparkline>
      <base-sparkline :series="series" :active="isActive" :tone="tone"/>
    </template>
    <template #headline>
      <div class="tabular-nums font-semibold" :class="tone">+{{ money(headlineValue) }}</div>
      <div class="text-eyebrow text-skin-muted">at retirement</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="brokerage" :active="isActive"/>
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
            <span class="text-skin-muted">at retirement</span>
            <span class="tabular-nums font-semibold" :class="tone">+{{ money(headlineValue) }}</span>
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
          <base-ico name="info"/> What is a brokerage? <span class="text-eyebrow">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
