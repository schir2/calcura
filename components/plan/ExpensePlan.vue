<template>
  <CommonCard>
    <CommonList>
      <PlanExpense
          v-for="(expense, index) in expenses"
          :key="index"
          :expenseIndex="index"
          :expense="expense"
          :showAdvancedOptions="expensePlan.planType === 'itemized'"
      />
    </CommonList>
  </CommonCard>

</template>
<script setup lang="ts">
import ExpensePlanConfig from "~/models/expense/ExpensePlanConfig";

interface Props {
  expensePlan: ExpensePlanConfig
}


const {expensePlan} = defineProps<Props>()
const expenses = reactive(expensePlan.expenses)
</script>