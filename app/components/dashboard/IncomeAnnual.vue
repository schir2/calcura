<script setup lang="ts">
import type {Income} from "#shared/types/Income";
import {getAnnualAmount} from "~/utils";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

type Props = {
  incomes: Income[],
}

const {incomes = []} = defineProps<Props>()
const totalAnnualIncome = computed(() => {
  return incomes.reduce((acc, income) => acc + getAnnualAmount(income.gross_income, income.frequency), 0);
})
</script>
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