<script setup lang="ts">
import type {Debt} from "#shared/types/Debt";
import {formatValue} from "~/utils/formatValue";
import {FormatType} from "~/types/FormatType";

type Props = {
  debts: Debt[],
}

const {debts = []} = defineProps<Props>()
const totalAnnualDebt = computed(() => {
  return debts.reduce((acc, debt) => acc + debt.principal, 0);
})
</script>
<template>
  <base-stat :value="formatValue(totalAnnualDebt, FormatType.Currency)">
    <template #label>
        <span class="flex gap-2">
          <icon class="text-2xl text-skin-error" name="mdi:trending-down"></icon>
          <span>Total Debt</span>
        </span>
    </template>
  </base-stat>
</template>