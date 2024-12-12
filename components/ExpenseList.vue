<template>

  <h2 class="text-3xl">Expense(s)</h2>
  <NButton @click="handleCreateExpense()">Add</NButton>
  <div class="container">
    <Expense v-for="(expense, index) in expenses" :expense="expense" :key="expense.id"
             @deleteExpense="handleDeleteExpense" @updateExpense="handleUpdateExpense"></Expense>
  </div>

</template>
<script lang="ts" setup>
import type {Expense} from "~/models/expense/Expense"
interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteExpense', 'updateExpense', 'createExpense']);
function handleDeleteExpense(expenseId: number){
  emit('deleteExpense',expenseId);
}
function handleCreateExpense(){
  emit('createExpense');
}

function handleUpdateExpense(expense: Expense) {
  emit('updateExpense', expense);
}

</script>