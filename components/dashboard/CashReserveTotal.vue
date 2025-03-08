<template>
    <base-stat :value="formatValue(totalAnnualCashReserve, FormatType.Currency)">
      <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-info" name="mdi:bank"></icon>
          <span>Total Cash Reserves</span>
        </span>
      </template>
    </base-stat>
</template>

<script setup lang="ts">
import type {CashReserve} from "~/types/CashReserve";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

interface Props {
  cashReserves: CashReserve[],
}

const {cashReserves = []} = defineProps<Props>()
const totalAnnualCashReserve = computed(() => {
  return cashReserves.reduce((acc, cashReserve) => acc + cashReserve.initialAmount, 0);
})
</script>