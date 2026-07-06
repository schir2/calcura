<script setup lang="ts">
import type {Expense, ExpenseUpdate} from "#shared/types/Expense";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {ExpenseState} from "#shared/types/ExpenseState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  expense: Expense
  isActive?: boolean
  expanded?: boolean
}
const {expense, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: ExpenseUpdate]
  delete: [id: number]
  toggle: []
}>()

const workspace = useWorkspaceStore()
const tone = 'text-skin-error'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')
const humanize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const expenseStates = computed<ExpenseState[]>(
    () => (managerStates?.value?.expense?.[expense.id] as ExpenseState[]) ?? []
)

// Per-year expense-cost series — amount_requested reflects the retirement-aware amount
// (retirement_spending_percentage / is_retirement_only), unlike amount_paid which drops to
// the cash-funded portion once retired. The headline is year 0 = current annual amount.
const series = computed<number[]>(() => {
  const points = expenseStates.value.map(
      state => state.amount_requested ?? state.amount_paid ?? state.base_amount ?? 0
  )
  return points.length ? points : [expense.amount ?? 0]
})

const headlineValue = computed(() => series.value[0] ?? 0)

const strategyFacet = computed<RichFacet>(() => ({
  label: humanize(expense.expense_type),
  icon: expense.expense_type === 'fixed' ? 'fixed' : 'variable',
}))

const facets = computed<RichFacet[]>(() => [
  strategyFacet.value,
  {label: expense.frequency},
])
</script>

<template>
  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="workspace.open('expense', expense.id)"
      @delete="emit('delete', expense.id)"
  >
    <template #icon>
      <base-ico name="expense" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ expense.name }}</span>
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
      <div class="text-[10px] text-skin-muted">/ yr</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="expense" :active="isActive"/>
    </template>
    <template #aside>
      <div class="flex flex-col gap-3 text-xs">
        <div>
          <span class="text-skin-muted uppercase tracking-wide text-[10px]">Projection</span>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">Today</span>
            <span class="tabular-nums font-medium" :class="tone">-{{ money(series[0] ?? 0) }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">/ yr</span>
            <span class="tabular-nums font-medium" :class="tone">-{{ money(headlineValue) }}</span>
          </div>
        </div>
        <div>
          <span class="text-skin-muted uppercase tracking-wide text-[10px]">Configuration</span>
          <div v-for="facet in facets" :key="facet.label" class="flex items-center gap-1.5 mt-1 text-skin-base">
            <base-ico v-if="facet.icon" :name="facet.icon" :class="tone"/>
            {{ facet.label }}
          </div>
        </div>
        <span class="mt-auto flex items-center gap-1 text-skin-error/70 cursor-not-allowed">
          <base-ico name="info"/> What is an expense? <span class="text-[10px]">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
