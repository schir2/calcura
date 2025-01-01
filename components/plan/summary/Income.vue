<template>
  <n-card>
    <template #header>
      <span class="text-2xl">
        <Icon name="uil:money-insert"/> Incomes</span>
    </template>
    <n-list v-if="incomes" class="space-y-2">
      <n-list-item v-for="(income, index) in incomes" :Key="index" class="flex justify-between">
        <div class="flex justify-between">
          <span class="col-span-3">{{ income.name }}</span> <n-tag type="info">{{ income.incomeType }}</n-tag>
        </div>
        <span class="text-end">${{ $humanize.intComma(income.grossIncome) }}</span>
      </n-list-item>
      <n-hr/>
      <li class="flex justify-between">
        <span>Total</span>
        <span class="text-end">${{ $humanize.intComma(totalIncome) }}</span>
      </li>
    </n-list>
  </n-card>

</template>

<script setup lang="ts">

import type {Income, IncomeType} from "~/models/income/Income";

interface Props {
  incomes: Income[]
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