<template>
  <h2 class="text-3xl">Plan Summary</h2>
  <CommonCard>
    <h3 class="text-2xl">Retirement Plan</h3>
    <CommonList>
      <CommonListItem><span>{{ planConfig.retirement.name }}</span></CommonListItem>
    </CommonList>
  </CommonCard>
  <PlanSummaryIncome :incomes="planConfig.incomes"/>
  <PlanSummaryDebt :debts="planConfig.debts"/>
  <PlanSummaryExpense :expenses="planConfig.expenses"/>
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
  planConfig: Plan
}

const props = defineProps<Props>()


</script>
