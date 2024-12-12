<template>
  <Form>
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Expense {{ expense.id }}: {{ currentExpenseConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="handleDeleteExpense">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetExpense">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateExpense">Save</NButton>
    </div>
    <CommonCard class="flex">
      <FormField :model="expense" :field="fieldMetadata.name"></FormField>
      <FormField :model="expense" :field="fieldMetadata.amount"></FormField>
      <FormSelect :model="currentExpenseConfig" :field="fieldMetadata.frequency"></FormSelect>
      <FormSelect :model="currentExpenseConfig" :field="fieldMetadata.type"></FormSelect>
      <FormField :model="currentExpenseConfig" :field="fieldMetadata.isEssential"></FormField>
      <FormField :model="currentExpenseConfig" :field="fieldMetadata.isTaxDeductible"></FormField>
    </CommonCard>
  </Form>
</template>
<script setup lang="ts">
import {expenseFields} from "~/forms/expenseForm";
import type {Expense} from "~/models/expense/Expense";

interface Props {
  expense: Expense
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, expense} = defineProps<Props>()
const fieldMetadata = expenseFields

const emit = defineEmits(['deleteExpense', 'updateExpense']);

function handleDeleteExpense() {
  assertDefined(expense.id, 'expenseId')
  emit('deleteExpense', expense.id)
}

function updateExpense() {
  assertDefined(expense.id, 'expenseId')
  emit('updateExpense', expense)
}

const currentExpenseConfig = reactive({...expense});
const isModified = computed(() =>
    JSON.stringify(currentExpenseConfig) !== JSON.stringify(expense)
);

function resetExpense() {
  Object.assign(currentExpenseConfig, {...expense});
}

function applyAdvancedOptions(advancedOptions: boolean) {
  return advancedOptions ? 'grid grid-cols-7 gap-3' : ''
}


</script>