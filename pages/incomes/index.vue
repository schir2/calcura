<template>
  <IncomeList :incomes="incomeConfigs"
            @createIncome="handleCreateIncome"
            @updateIncome="handleUpdateIncome"
            @deleteIncome="handleDeleteIncome"
  ></IncomeList>
</template>
<script setup lang="ts">
import {defaultIncomeFactory} from "~/models/income/IncomeFactories";
import type {Income} from "~/models/income/Income";

import {useIncomeService} from "~/composables/api/useIncomeService";

const incomeService = useIncomeService();


async function handleCreateIncome() {
  const incomeConfig = defaultIncomeFactory();
  await incomeService.create(incomeConfig)
  await loadIncomes();
}

async function handleDeleteIncome(index: number) {
  await incomeService.delete(index)
  await loadIncomes();
}

async function handleUpdateIncome(income: Income) {
  assertDefined(income.id, 'income id');
  await incomeService.update(income.id, income)
  await loadIncomes();
}

const {$api} = useNuxtApp()

const incomeConfigs = ref<Income[]>([])

async function loadIncomes() {
  if (!$api) {
    console.error('API service not available');
  }
  try {
    incomeConfigs.value = await incomeService.list();
  } catch (error) {
    console.error('Error loading incomes:', error);
  }
}

onMounted(async () => {
  await loadIncomes();
});
</script>
