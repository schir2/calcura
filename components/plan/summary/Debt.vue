<template>
  <CommonCard>
    <h3 class="text-2xl">Debt</h3>
    <ul v-if="debts">
      <li v-for="(debt, index) in debts" :Key="index" class="grid grid-cols-5">
        <span class="col-span-3">{{ debt.name }}</span>
        <span>{{ debt.interestRate }}%</span>
        <span class="text-end">${{ debt.principal }}</span>
      </li>
      <li class="grid grid-cols-2">
        <span>Total</span>
        <span class="text-end">{{ totalDebt }}</span>
      </li>
    </ul>
  </CommonCard>

</template>

<script setup lang="ts">

import type Debt from "~/types/Debt";

interface Props {
  debts: Debt[]
}

const props = defineProps<Props>()
const totalDebt = computed(() => props.debts.reduce((total, debt) => total + debt.principal, 0))

</script>