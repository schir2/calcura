<template>
  <h2 class="text-3xl">Plan Summary</h2>
  <CommonCard>
    <h3 class="text-2xl">Retirement Plan</h3>
    <CommonList>
      <CommonListItem><span>{{ plan.name }}</span></CommonListItem>
    </CommonList>
  </CommonCard>
  <PlanSummaryIncome :incomes="plan.incomes"/>
  <PlanSummaryDebt :debts="plan.debts"/>
  <PlanSummaryExpense :expenses="plan.expenses"/>
  <PlanSummaryCashReserve :cashReserves="plan.cashReserves"/>
  <section>
    <h3 class="text-2xl">Expenses</h3>
  </section>
  <section>
    <h3 class="text-2xl">Investments</h3>
  </section>

</template>
<script setup lang="ts">
import type {Plan} from "~/models/plan/Plan";

interface Props {
  plan: Plan
}

const props = defineProps<Props>()


</script>
