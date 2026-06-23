<script setup lang="ts">
import type {OrchestratorState} from "#shared/types/OrchestratorState";
import humanize from "humanize-plus"

type Props = {
  planStates: OrchestratorState[]
}

const columns = [
  {
    title: 'Age',
    key: 'age',
  },
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
    age: state.plan.age,
    grossIncome: `$${humanize.intComma(state.income.gross)}`,
    taxableIncome: `$${humanize.intComma(state.income.taxable)}`,
    taxedIncome: `$${humanize.intComma(state.income.net)}`,
    retirementIncomeProjected: `$${humanize.intComma(state.plan.retirement_income_projected)}`,
    retirementIncomeGoal: `$${humanize.intComma(state.plan.retirement_income_goal)}`,
    taxedCapital: `$${humanize.intComma(state.cash.net)}`,
    taxableCapital: `$${humanize.intComma(state.cash.taxable)}`,
    taxedWithdrawals: `$${humanize.intComma(state.cash.spent)}`,
    expensesTotal: `$${humanize.intComma(state.liabilities.expense.balance_start)}`,
    expensesPaid: `$${humanize.intComma(state.liabilities.expense.paid)}`,
    expensesShortfall: `$${humanize.intComma(state.liabilities.expense.shortfall)}`,
    savingsTaxDeferredEndOfYear: `$${humanize.intComma(state.assets.tax_deferred.balance_end)}`,
    savingsTaxExemptEndOfYear: `$${humanize.intComma(state.assets.tax_exempt.balance_end)}`,
    savingsTaxableEndOfYear: `$${humanize.intComma(state.assets.taxable.balance_end)}`,
    savingsEndOfYear: `$${humanize.intComma(state.assets.tax_deferred.balance_end + state.assets.tax_exempt.balance_end + state.assets.taxable.balance_end + state.cash.net)}`,
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