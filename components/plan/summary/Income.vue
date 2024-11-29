<template>
  <CommonCard>
    <h3 class="text-2xl">Incomes</h3>
    <ul v-if="incomes">
      <li v-for="(income, index) in incomes" :Key="index" class="grid grid-cols-5">
        <span class="col-span-3">{{ income.name }}</span>
        <CommonChip class="bg-skin-success">{{ income.incomeType }}</CommonChip>
        <span class="text-end">{{ income.grossIncome }}</span>
      </li>
      <li class="grid grid-cols-2">
        <span>Total</span>
        <span class="text-end">{{ totalIncome }}</span>
      </li>
    </ul>
  </CommonCard>

</template>

<script setup lang="ts">

import type IncomeConfig from "~/models/income/IncomeConfig";
import type {IncomeType} from "~/models/income/IncomeConfig";

interface Props {
  incomes: IncomeConfig[]
}

const props = defineProps<Props>()
const incomeSummary = computed(() => {
  let result: Record<IncomeType, number> = {
    ordinary: 0
  }
  props.incomes.forEach((income) => {
    result[income.incomeType] += income.grossIncome
  })
  return result
})
const totalIncome = computed(() => props.incomes.reduce((total, income) => total + income.grossIncome, 0))

</script>