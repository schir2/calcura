<template>
  <n-card title="Expense(s)">
    <n-list>
      <ExpenseListItem v-for="(expense, index) in expenses" :expense="expense" :key="expense.id"
                       @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></ExpenseListItem>
    </n-list>
    <template #footer>
      <base-stat class="text-end">${{ $humanize.intComma(totalExpense) }}/year</base-stat>
    </template>
  </n-card>

</template>
<script lang="ts" setup>
import type {Expense, ExpenseInsert, ExpenseUpdate} from "#shared/types/Expense";
import {getAnnualAmount} from "~/utils";

type Props = {
  expenses: Expense[]
}

const props = defineProps<Props>()


const totalExpense = computed(() => {
  return props.expenses.reduce((total, expense) => total + getAnnualAmount(expense.amount, expense.frequency), 0)
})

const emit = defineEmits<{
  create: [insert: ExpenseInsert]
  update: [id: number, update: ExpenseUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: ExpenseInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: ExpenseUpdate) {
  emit('update', id, update)
}

</script>