<script setup lang="ts">
import type {Expense} from "#shared/types/Expense";
import {getAnnualAmount} from "~/utils";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

type Props = {
  expenses: Expense[],
}
const {expenses = []} = defineProps<Props>()
const totalAnnualExpense = computed(() => {
  return expenses.reduce((acc, expense) => acc + getAnnualAmount(expense.amount, expense.frequency), 0);
})
</script>
<template>
  <base-stat :value="formatValue(totalAnnualExpense, FormatType.Currency)">
    <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-error" name="mdi:cash-minus"></icon>
          <span>Annual Expenses</span>
        </span>
    </template>
  </base-stat>
</template>