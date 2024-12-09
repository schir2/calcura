<template>
  <CommonListItem :class="applyAdvancedOptions(showAdvancedOptions)">
    <FormField :model="expense" :field="fieldMetadata.name"></FormField>
    <FormField :model="expense" :field="fieldMetadata.amount"></FormField>
    <FormSelect v-show="showAdvancedOptions" :model="expense" :field="fieldMetadata.frequency"></FormSelect>
    <FormSelect v-show="showAdvancedOptions" :model="expense" :field="fieldMetadata.type"></FormSelect>
    <FormField v-show="showAdvancedOptions" :model="expense" :field="fieldMetadata.isEssential"></FormField>
    <FormField v-show="showAdvancedOptions" :model="expense" :field="fieldMetadata.isTaxDeductible"></FormField>
    <span><NButton iconLeft="mdi:delete" @click="handleDeleteExpense">Delete</NButton></span>
  </CommonListItem>
</template>
<script setup lang="ts">
import type ExpenseConfig from "~/models/expense/ExpenseConfig";
import {expenseFields} from "~/forms/expenseForm";

interface Props {
  expense: ExpenseConfig,
  expenseIndex: number,
  showAdvancedOptions?: boolean,
}

const {expense, expenseIndex, showAdvancedOptions = true} = defineProps<Props>()

function applyAdvancedOptions(advancedOptions: boolean) {
  return advancedOptions ? 'grid grid-cols-7 gap-3' : ''
}

const fieldMetadata = expenseFields

const emit = defineEmits({
  deleteExpense(payload: { index: number }) {
  }
})

function handleDeleteExpense(expenseIndex: number) {
  emit('deleteExpense', {index: expenseIndex})
}

</script>