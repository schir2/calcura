<template>
  <CommonCard>
    <h3 class="text-2xl">Cash Reserve(s)</h3>
    <ul v-if="cashReserves">
      <li v-for="(cashReserve, index) in cashReserves" :Key="index" class="">
        <n-tag :bordered="false" type="success">{{ cashReserve.cashReserveStrategy }}</n-tag>
        <span class="text-end">${{ cashReserve.initialAmount }}</span>
      </li>
      <li class="grid grid-cols-2">
        <span>Total</span>
        <span class="text-end">{{ totalCashReserve }}</span>
      </li>
    </ul>
  </CommonCard>

</template>

<script setup lang="ts">

import type {CashReserve} from "~/types/CashReserve";

interface Props {
  cashReserves: CashReserve[]
}

const props = defineProps<Props>()
const totalCashReserve = computed(() => props.cashReserves.reduce((total, cashReserve) => total + cashReserve.initialAmount, 0))

</script>