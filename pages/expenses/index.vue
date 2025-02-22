<template>
  <ExpenseList :expenses="expenses"
               @create="handleCreateExpense"
               @update="handleUpdateExpense"
               @delete="handleDeleteExpense"
  ></ExpenseList>
</template>
<script setup lang="ts">
import type {Expense, ExpensePartial} from "~/models/expense/Expense";

import {useExpenseService} from "~/composables/api/useExpenseService";

const expenseService = useExpenseService();


async function handleCreateExpense(expenseTemplate: ExpensePartial) {
  const expense = await expenseService.create(expenseTemplate)
  await loadExpenses();
}

async function handleDeleteExpense(expense: Expense) {
  await expenseService.remove(expense.id)
  await loadExpenses();
}

async function handleUpdateExpense(expense: Expense) {
  await expenseService.update(expense.id, expense)
  await loadExpenses();
}

const expenses = ref<Expense[]>([])
const loading = ref<boolean>(true);

async function loadExpenses() {
  try {
    expenses.value = await expenseService.list();
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadExpenses();
});
</script>
