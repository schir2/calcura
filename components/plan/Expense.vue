<template>
  <CommonCard>
    <FormField :model="expense" :field="fieldMetadata.name"></FormField>
    <FormField :model="expense" :field="fieldMetadata.amount"></FormField>
    <FormSelect :model="expense" :field="fieldMetadata.frequency"></FormSelect>
    <FormSelect :model="expense" :field="fieldMetadata.type"></FormSelect>
    <FormField :model="expense" :field="fieldMetadata.isEssential"></FormField>
    <FormField :model="expense" :field="fieldMetadata.isTaxDeductible"></FormField>
  </CommonCard>
</template>
<script setup lang="ts">
import type Expense from "~/models/Expense";
import {expenseFields} from "~/forms/expenseForm";

interface Props {
  expense: Expense,
  expenseIndex: number,
}

const {expense, expenseIndex} = defineProps<Props>()

const fieldMetadata = expenseFields
</script>