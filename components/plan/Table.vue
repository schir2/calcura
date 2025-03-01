<script setup lang="ts">
import type {PlanState} from "~/types/PlanState";
import humanize from "humanize-plus"

interface Props {
  planStates: PlanState[]
}

const columns = [
  {title: 'Age',
  key: 'age',},
  {
    title: 'Income',
    key: 'income',
    children: [
      {
        title: 'Gross',
        key: 'grossIncome'
      },
      {
        title: 'Taxable',
        key: 'taxableIncome'
      },
      {
        title: 'Taxed',
        key: 'taxedIncome'
      },
      {
        title: 'Retirement Projected',
        key: 'retirementIncomeProjected'
      },
      {
        title: 'Retirement Goal',
        key: 'retirementIncomeGoal'
      },
    ]
  },
  {
    title: 'Capital',
    key: 'capital',
    children: [
      {title: 'Taxed', key: 'taxedCapital'},
      {title: 'Taxable', key: 'taxableCapital'},
    ]
  },
  {
    title: 'Expenses',
    key: 'expenses',
    children: [
      {title: 'Taxed WithDrawals', key: 'taxedWithdrawals'},
      {title: 'Total', key: 'expensesTotal'},
      {title: 'Paid', key: 'expensesPaid'},
      {title: 'Shortfall', key: 'expensesShortfall'},

    ]
  },
  {
    title: 'Savings',
    key: 'savings',
    children: [
      {title: 'Tax Deferred', key: 'savingsTaxDeferredEndOfYear'},
      {title: 'Tax Exempt', key: 'savingsTaxExemptEndOfYear'},
      {title: 'Taxable', key: 'savingsTaxableEndOfYear'},
      {title: 'Gross', key: 'savingsEndOfYear'},
    ]
  },
]
const props = defineProps<Props>()

const formattedPlanStates = computed(() => {
  return props.planStates.map(state => ({
    age: state.age,
    grossIncome: `$${humanize.intComma(state.grossIncome)}`,
    taxableIncome: `$${humanize.intComma(state.taxableIncome)}`,
    taxedIncome: `$${humanize.intComma(state.taxedIncome)}`,
    retirementIncomeProjected: `$${humanize.intComma(state.retirementIncomeProjected)}`,
    retirementIncomeGoal: `$${humanize.intComma(state.retirementIncomeGoal)}`,
    taxedCapital: `$${humanize.intComma(state.taxedCapital)}`,
    taxableCapital: `$${humanize.intComma(state.taxableCapital)}`,
    taxedWithdrawals: `$${humanize.intComma(state.taxedWithdrawals)}`,
    expensesTotal: `$${humanize.intComma(state.expensesTotal)}`,
    expensesPaid: `$${humanize.intComma(state.expensesPaid)}`,
    expensesShortfall: `$${humanize.intComma(state.expensesShortfall)}`,
    savingsTaxDeferredEndOfYear: `$${humanize.intComma(state.savingsTaxDeferredEndOfYear)}`,
    savingsTaxExemptEndOfYear: `$${humanize.intComma(state.savingsTaxExemptEndOfYear)}`,
    savingsTaxableEndOfYear: `$${humanize.intComma(state.savingsTaxableEndOfYear)}`,
    savingsEndOfYear: `$${humanize.intComma(state.savingsEndOfYear)}`,
  }));
});

const showAll = ref<boolean>(false)
const displayedPlanStates = computed(() => {
  if (showAll.value) {
    return formattedPlanStates.value;
  }
  const total = formattedPlanStates.value.length;
  if (total <= 10) return formattedPlanStates.value;

  return [
    ...formattedPlanStates.value.slice(0, 5),
    {age: "..."},
    ...formattedPlanStates.value.slice(-5)
  ];
});
</script>
<template>
  <nav class="mb-2">
    <transition mode="out-in" name="slide-up">
      <n-button type="primary" primary v-if="!showAll" @click="showAll = true">
        Show Full Table
      </n-button>
      <n-button type="primary" primary v-else @click="showAll = false">
        Collapse Table
      </n-button>
    </transition>
  </nav>
  <n-data-table
      size="small"
      max-height="480px"
      :columns="columns"
      :data="displayedPlanStates"
      striped
  >
  </n-data-table>
</template>
<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>