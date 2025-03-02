<template>
  <h2 class="text-3xl">Plan Summary</h2>
  <CommonCard>
    <h3 class="text-2xl">Retirement Plan</h3>
    <CommonList>
      <CommonListItem><span>{{ plan.name }}</span></CommonListItem>
    </CommonList>
  </CommonCard>
  <PlanSummaryIncome v-if="plan.income.length !== 0" :incomes="plan.income"/>
  <PlanSummaryDebt v-if="plan.debts.length !== 0" :debts="plan.debts"/>
  <PlanSummaryExpense v-if="plan.expenses.length !== 0" :expenses="plan.expenses"/>
  <PlanSummaryCashReserve v-if="plan.cashReserve.length !== 0" :cashReserves="plan.cashReserve"/>

</template>
<script setup lang="ts">
import type {Plan} from "~/types/Plan";

interface Props {
  plan: Plan
}

const props = defineProps<Props>()


</script>
