<template>
    <base-stat :value="formatValue(totalAnnualIncome, FormatType.Currency)">
      <template #label>
        <span class="flex gap-1">
          <icon class="text-2xl text-skin-success" name="mdi:currency-usd"></icon>
          <span>Annual Income</span>
        </span>
      </template>
    </base-stat>
</template>

<script setup lang="ts">
import type {Income} from "~/types/Income";
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