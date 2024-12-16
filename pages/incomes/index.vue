<template>
  <IncomeList :incomes="incomes"
               @create="handleCreateIncome"
               @update="handleUpdateIncome"
               @delete="handleDeleteIncome"
  ></IncomeList>
</template>
<script setup lang="ts">
import type {Income, IncomePartial} from "~/models/income/Income";

import {useIncomeService} from "~/composables/api/useIncomeService";

const incomeService = useIncomeService();


async function handleCreateIncome(incomeTemplate: IncomePartial) {
  const income = await incomeService.create(incomeTemplate)
  await loadIncomes();
}

async function handleDeleteIncome(income: Income) {
  await incomeService.delete(income.id)
  await loadIncomes();
}

async function handleUpdateIncome(income: Income) {
  await incomeService.update(income.id, income)
  await loadIncomes();
}

const incomes = ref<Income[]>([])
const loading = ref<boolean>(true);

async function loadIncomes() {
  try {
    incomes.value = await incomeService.list();
  } catch (error) {
    console.error('Error loading incomes:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadIncomes();
});
</script>
