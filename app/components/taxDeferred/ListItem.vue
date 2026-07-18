<script setup lang="ts">
import type {TaxDeferred, TaxDeferredUpdate} from "#shared/types/TaxDeferred";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {TaxDeferredState} from "#shared/types/TaxDeferredState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  taxDeferred: TaxDeferred
  isActive?: boolean
  expanded?: boolean
}
const {taxDeferred, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: TaxDeferredUpdate]
  delete: [id: number]
  toggle: []
}>()

const workspace = useWorkspaceStore()
const tone = 'text-skin-info'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const taxDeferredStates = computed<TaxDeferredState[]>(
    () => (managerStates?.value?.tax_deferred?.[taxDeferred.id] as TaxDeferredState[]) ?? []
)

// Per-year balance series; the headline is the last point = projected balance at retirement.
// Edge case (#83): when the plan never reaches retirement the last available point is used,
// falling back to the initial balance.
const series = computed<number[]>(() => {
  const points = taxDeferredStates.value.map(
      state => state.balance_end_of_year ?? state.balance_start_of_year ?? 0
  )
  return points.length ? points : [taxDeferred.initial_balance ?? 0]
})

const headlineValue = computed(() => series.value[series.value.length - 1] ?? 0)

const strategyFacet = computed<RichFacet | null>(() => {
  switch (taxDeferred.elective_contribution_strategy) {
    case 'none':
      return null
    case 'until_company_match':
      return {label: 'Up to employer match', icon: 'growthRate'}
    case 'percentage_of_income':
      return {label: `${taxDeferred.elective_contribution_percentage ?? 0}% of income`, icon: 'growthRate'}
    case 'max':
      return {label: 'Maxing out', icon: 'fixed'}
    default:
      return {label: `${money(taxDeferred.elective_contribution_fixed_amount ?? 0)}/yr`, icon: 'fixed'}
  }
})

const employerFacet = computed<RichFacet | null>(() => {
  if (!taxDeferred.employer_contributes) return null
  switch (taxDeferred.employer_contribution_strategy) {
    case 'percentage_of_contribution':
      return {
        label: `Match ${taxDeferred.employer_match_percentage ?? 0}% up to ${taxDeferred.employer_match_percentage_limit ?? 0}%`,
        icon: 'growthRate',
      }
    case 'percentage_of_compensation':
      return {label: `${taxDeferred.employer_compensation_match_percentage ?? 0}% of pay`, icon: 'growthRate'}
    case 'fixed':
      return {label: `Match ${money(taxDeferred.employer_contribution_fixed_amount ?? 0)}/yr`, icon: 'fixed'}
    default:
      return null
  }
})

const facets = computed<RichFacet[]>(() => {
  const list: RichFacet[] = []
  if (strategyFacet.value) list.push(strategyFacet.value)
  list.push({label: `Growth ${taxDeferred.growth_rate}%`, icon: 'growthRate'})
  if (employerFacet.value) list.push(employerFacet.value)
  return list
})
</script>

<template>
  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="workspace.open('tax_deferred', taxDeferred.id)"
      @delete="emit('delete', taxDeferred.id)"
  >
    <template #icon>
      <base-ico name="taxDeferred" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ taxDeferred.name }}</span>
    </template>
    <template v-if="strategyFacet" #strategy>
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
      <common-rich-list-item-chart :series="series" model-name="tax_deferred" :active="isActive"/>
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
          <base-ico name="info"/> What is a 401(k)? <span class="text-eyebrow">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
