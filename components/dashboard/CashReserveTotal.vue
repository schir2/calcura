<template>
  <n-card size="small" class="opacity-85">
    <n-statistic :value="formatValue(totalAnnualCashReserve, FormatType.Currency)">
      <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-info" name="mdi:bank"></icon>
          <span class="text- font-bold">Total Cash Reserves</span>
        </span>
      </template>
    </n-statistic>
  </n-card>
</template>

<script setup lang="ts">
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

interface Props {
  cashReserves: CashReserve[],
}

const {cashReserves} = defineProps<Props>()
const totalAnnualCashReserve = computed(() => {
  return cashReserves.reduce((acc, cashReserve) => acc + cashReserve.initialAmount, 0);
})
</script>