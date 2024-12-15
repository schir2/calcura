<template>
  <ExpenseList :expenses="expenseConfigs"
            @createExpense="handleCreateExpense"
            @updateExpense="handleUpdateExpense"
            @deleteExpense="handleDeleteExpense"
  ></ExpenseList>
</template>
<script setup lang="ts">
import {defaultExpenseFactory} from "~/models/expense/ExpenseFactories";
import type {Expense} from "~/models/expense/Expense";

import {useExpenseService} from "~/composables/api/useExpenseService";

const expenseService = useExpenseService();


async function handleCreateExpense() {
  const expenseConfig = defaultExpenseFactory();
  await expenseService.create(expenseConfig)
  await loadExpenses();
}

async function handleDeleteExpense(index: number) {
  await expenseService.delete(index)
  await loadExpenses();
}

async function handleUpdateExpense(expense: Expense) {
  await expenseService.update(expense.id, expense)
  await loadExpenses();
}

const {$api} = useNuxtApp()

const expenseConfigs = ref<Expense[]>([])

async function loadExpenses() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    expenseConfigs.value = await expenseService.list();
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
}

onMounted(async () => {
  await loadExpenses();
});
</script>
