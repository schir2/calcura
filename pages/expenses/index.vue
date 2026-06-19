<template>
  <ExpenseList :expenses="expenses"
               @create="handleCreateExpense"
               @update="handleUpdateExpense"
               @delete="handleDeleteExpense"
  ></ExpenseList>
</template>
<script setup lang="ts">
import type {Expense, ExpenseInsert, ExpenseUpdate} from "~/types/Expense";

import {useExpenseService} from "~/composables/api/useExpenseService";

const expenseService = useExpenseService();


async function handleCreateExpense(insert: ExpenseInsert) {
  await expenseService.create(insert)
  await loadExpenses();
}

async function handleDeleteExpense(id: number) {
  await expenseService.remove(id)
  await loadExpenses();
}

async function handleUpdateExpense(id: number, update: ExpenseUpdate) {
  await expenseService.update(id, update)
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
