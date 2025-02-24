<template>
  <n-card title="Expense(s)">
    <n-list>
      <ExpenseListItem v-for="(expense, index) in expenses" :expense="expense" :key="expense.id"
                       @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                       @remove="handleRemove"></ExpenseListItem>
    </n-list>
    <template #footer>
      <n-statistic class="text-end">${{ $humanize.intComma(totalExpense) }}/year</n-statistic>
    </template>
  </n-card>

</template>
<script lang="ts" setup>
import type {Expense, ExpenseTemplate} from "~/types/Expense";
import {getAnnualAmount} from "~/utils";

interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()


const totalExpense = computed(() => {
  return props.expenses.reduce((total, expense) => total + getAnnualAmount(expense.amount, expense.frequency), 0)
})

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(expense: Expense) {
  emit('delete', expense);
}

function handleCreate(expenseTemplate: ExpenseTemplate) {
  emit('create', expenseTemplate);
}

function handleUpdate(expense: Expense) {
  emit('update', expense);
}

function handleRemove(expense: Expense) {
  emit('remove', expense)
}

</script>