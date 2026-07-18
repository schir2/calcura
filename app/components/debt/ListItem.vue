<script setup lang="ts">
import type {Debt, DebtUpdate} from "#shared/types/Debt";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {DebtState} from "#shared/types/DebtState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  debt: Debt
  isActive?: boolean
  expanded?: boolean
}
const {debt, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: DebtUpdate]
  delete: [id: number]
  toggle: []
}>()

const workspace = useWorkspaceStore()
const tone = 'text-skin-error'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const debtStates = computed<DebtState[]>(
    () => (managerStates?.value?.debt?.[debt.id] as DebtState[]) ?? []
)

// Per-year remaining principal; the series DECLINES toward 0 as the debt is paid off.
const series = computed<number[]>(() => {
  const points = debtStates.value.map(
      state => state.principal_end_of_year ?? state.principal_start_of_year ?? 0
  )
  return points.length ? points : [debt.principal ?? 0]
})

const headlineValue = computed(() => series.value[0] ?? debt.principal ?? 0)

const payoffLabel = computed(() => {
  const payoffIndex = series.value.findIndex(point => point <= 0)
  if (payoffIndex === -1) return 'remaining'
  return `payoff ${new Date().getFullYear() + payoffIndex}`
})

const strategyFacet = computed<RichFacet>(() => {
  switch (debt.payment_strategy) {
    case 'minimum_payment':
      return {label: 'Minimum payments', icon: 'trendingDown'}
    case 'maximum_payment':
      return {label: 'Maximum payments', icon: 'growthRate'}
    case 'percentage_of_debt':
      return {label: `${debt.payment_percentage ?? 0}% of debt`, icon: 'variable'}
    default:
      return {label: `${money(debt.payment_fixed_amount ?? 0)}/yr`, icon: 'fixed'}
  }
})

const facets = computed<RichFacet[]>(() => [
  strategyFacet.value,
  {label: `${debt.interest_rate}% interest`, icon: 'interest'},
])
</script>

<template>
  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="workspace.open('debt', debt.id)"
      @delete="emit('delete', debt.id)"
  >
    <template #icon>
      <base-ico name="debt" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ debt.name }}</span>
    </template>
    <template #strategy>
      <base-ico v-if="strategyFacet.icon" :name="strategyFacet.icon"/>
      {{ strategyFacet.label }}
    </template>
    <template #sparkline>
      <base-sparkline :series="series" :active="isActive" :tone="tone"/>
    </template>
    <template #headline>
      <div class="tabular-nums font-semibold" :class="tone">-{{ money(headlineValue) }}</div>
      <div class="text-eyebrow text-skin-muted">{{ payoffLabel }}</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="debt" :active="isActive"/>
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
            <span class="text-skin-muted">{{ payoffLabel }}</span>
            <span class="tabular-nums font-semibold" :class="tone">-{{ money(headlineValue) }}</span>
          </div>
        </div>
        <div>
          <span class="text-eyebrow text-skin-muted">Configuration</span>
          <div v-for="facet in facets" :key="facet.label" class="flex items-center gap-1.5 mt-1 text-skin-base">
            <base-ico v-if="facet.icon" :name="facet.icon" :class="tone"/>
            {{ facet.label }}
          </div>
        </div>
        <span class="mt-auto flex items-center gap-1 text-skin-error/70 cursor-not-allowed">
          <base-ico name="info"/> What is a debt? <span class="text-eyebrow">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
