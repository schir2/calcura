<template>
  <n-card size="small" class="opacity-85">
  <n-statistic :value="formatValue(totalAnnualExpense, FormatType.Currency)">
    <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-error" name="mdi:cash-minus"></icon>
          <span class="text- font-bold">Annual Expenses</span>
        </span>
    </template>
    </n-statistic>
  </n-card>
</template>

<script setup lang="ts">
import type {Expense} from "~/types/Expense";
import {getAnnualAmount} from "~/utils";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

interface Props {
  expenses: Expense[],
}
const {expenses = []} = defineProps<Props>()
const totalAnnualExpense = computed(() =>{
  return expenses.reduce((acc, expense) => acc + getAnnualAmount(expense.amount, expense.frequency), 0);
})
</script>