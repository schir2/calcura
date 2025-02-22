<template>
  <n-card size="small" class="opacity-85">
    <n-statistic :value="formatValue(totalAnnualIncome, FormatType.Currency)">
      <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-success" name="mdi:currency-usd"></icon>
          <span class="text- font-bold">Annual Income</span>
        </span>
      </template>
    </n-statistic>
  </n-card>
</template>

<script setup lang="ts">
import type {Income} from "~/models/income/Income";
import {getAnnualAmount} from "~/utils";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

interface Props {
  incomes: Income[],
}

const {incomes = []} = defineProps<Props>()
const totalAnnualIncome = computed(() => {
  return incomes.reduce((acc, income) => acc + getAnnualAmount(income.grossIncome, income.frequency), 0);
})
</script>