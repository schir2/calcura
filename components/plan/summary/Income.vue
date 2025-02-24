<template>
  <n-card>
    <template #header>
      <span class="text-2xl">
        <Icon name="uil:money-insert"/> Incomes</span>
    </template>
    <n-list v-if="incomes" class="space-y-1">
      <n-list-item v-for="(income, index) in incomes" :Key="index" class="flex justify-between">
        <div class="flex justify-between">
          <div class="space-y-1">
            <span class="col-span-3">{{ income.name }}</span>
            <div class="flex gap-1 items-end">
              <n-tag size="small" type="info">{{ income.incomeType }}</n-tag>
              <n-tag size="small" type="info">
                <template #icon>
                  <Icon name="mdi-calendar"></Icon>
                </template>
                {{ income.frequency }}
              </n-tag>
              <n-tag size="small" v-if="income.growthRate">
                <template #icon>
                  <Icon name="mdi:trending-up"></Icon>
                </template>
                {{ income.growthRate }}%
              </n-tag>
            </div>
          </div>
          <span class="text-end text-lg">${{ $humanize.intComma(income.grossIncome) }}</span>
        </div>
      </n-list-item>
      <n-list-item>
        <p class="text-end text-2xl">${{ $humanize.intComma(totalIncome) }}</p>
      </n-list-item>
    </n-list>
  </n-card>

</template>

<script setup lang="ts">

import type {Income, IncomeType} from "~/types/Income";

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