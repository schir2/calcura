<template>
  <CommonCard>
    <h3 class="text-2xl">Expenses</h3>
    <ul v-if="expenses">
      <li v-for="(expense, index) in expenses" :Key="index">
        <ul class="grid grid-cols-5">
          <li  class="col-span-2"><span>{{ expense.name }} <Icon v-if="expense.isEssential" class="text-skin-error" name="uil:exclamation-circle"/></span></li>
          <li class="flex gap-3 col-span-2">
            <n-tag type="success">{{ expense.expenseType }}</n-tag>
            <n-tag type="warning">{{ expense.frequency }}</n-tag>
            {{expense.growthRate}}
          </li>
          <li class="text-end"><span>${{ getAnnualExpenseAmount(expense) }}</span></li>
        </ul>
      </li>
      <li class="grid grid-cols-2">
        <span>Total</span>
        <span class="text-end">${{ totalExpense }}</span>
      </li>
    </ul>
  </CommonCard>

</template>

<script setup lang="ts">

import {type Expense} from "~/models/expense/Expense";
import {getAnnualExpenseAmount} from "~/utils/expenseUtils";

interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()
const totalExpense = computed(() => {
  return props.expenses.reduce((total, expense) => total + getAnnualExpenseAmount(expense), 0)
})

</script>