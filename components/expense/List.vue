<template>
  <n-card title="Expense(s)">
    <template #header-extra>
      <ExpenseTemplatePicker @create="handleCreate"/>
    </template>
    <n-list>
      <ExpenseListItem v-for="(expense, index) in expenses" :expense="expense" :key="expense.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></ExpenseListItem>
    </n-list>
  </n-card>

</template>
<script lang="ts" setup>
import type {Expense, ExpenseTemplate} from "~/models/expense/Expense";

interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()

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