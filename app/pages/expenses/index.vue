<template>
  <ExpenseList :expenses="expenseStore.list"
               @create="handleCreateExpense"
               @update="handleUpdateExpense"
               @delete="handleDeleteExpense"
  ></ExpenseList>
</template>
<script setup lang="ts">
import type {ExpenseInsert, ExpenseUpdate} from "#shared/types/Expense";

const expenseStore = useExpenseStore()

onMounted(() => expenseStore.fetchAll())

async function handleCreateExpense(insert: ExpenseInsert) {
  await expenseStore.create(insert)
}

async function handleDeleteExpense(id: number) {
  await expenseStore.purge(id)
}

async function handleUpdateExpense(id: number, update: ExpenseUpdate) {
  await expenseStore.patch(id, update)
}
</script>