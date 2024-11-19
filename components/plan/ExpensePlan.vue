<template>
  <CommonCard class="space-y-6 bg-skin-muted">
    <div class="flex align-middle gap-6">
      <h2 class="text-3xl">Expense Plan</h2>
    </div>
    <TransitionGroup
        name="custom-classes"
        enter-active-class="animate__animated animate__tada"
        leave-active-class="animate__animated animate__bounceOutRight"
    >
    </TransitionGroup>
    <PlanExpense
        v-for="(expense, index) in simpleExpensePlan.expenses"
        :key="index"
        :expenseIndex="index"
        :expense="expense"/>
    <PlanExpense
        v-for="(expense, index) in itemizedExpensePlan.expenses"
        :key="index"
        :expenseIndex="index"
        :expense="expense"/>
  </CommonCard>

</template>
<script setup lang="ts">
import type ExpensePlan from "~/models/ExpensePlan";

interface Props {
  simpleExpensePlan: ExpensePlan,
  itemizedExpensePlan: ExpensePlan,
  showAdvancedOptions?: boolean;
}

const {simpleExpensePlan, itemizedExpensePlan, showAdvancedOptions = false} = defineProps<Props>()
</script>
