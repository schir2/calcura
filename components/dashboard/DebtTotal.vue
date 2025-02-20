<template>
  <n-card size="small" class="opacity-85">
    <n-statistic :value="formatValue(totalAnnualDebt, FormatType.Currency)">
      <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-error" name="mdi:trending-down"></icon>
          <span class="text- font-bold">Total Debt</span>
        </span>
      </template>
    </n-statistic>
  </n-card>
</template>

<script setup lang="ts">
import type {Debt} from "~/models/debt/Debt";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

interface Props {
  debts: Debt[],
}

const {debts} = defineProps<Props>()
const totalAnnualDebt = computed(() => {
  return debts.reduce((acc, debt) => acc + debt.principal, 0);
})
</script>