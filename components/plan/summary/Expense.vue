<template>
  <CommonCard>
    <h3 class="text-2xl">Expenses</h3>
    <ul v-if="expenses">
      <li v-for="(expense, index) in expenses" :Key="index" class="grid grid-cols-5">
        <span class="col-span-3">{{ expense.name }}</span>
        <CommonChip class="bg-skin-success">{{ expense.type }}</CommonChip>
        <span class="text-end">{{ expense.amount }}</span>
      </li>
      <li class="grid grid-cols-2">
        <span>Total</span>
        <span class="text-end">{{ totalExpense }}</span>
      </li>
    </ul>
  </CommonCard>

</template>

<script setup lang="ts">

import type ExpenseConfig from "~/models/expense/ExpenseConfig";

interface Props {
  expenses: ExpenseConfig[]
}

const props = defineProps<Props>()
const totalExpense = computed(() => props.expenses.reduce((total, expense) => total + expense.amount, 0))

</script>