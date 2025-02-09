<template>
  <n-skeleton v-if="loading" text :repeat="2"/>
  <IncomeList v-else :incomes="incomes"
              @create="handleCreateIncome"
              @update="handleUpdateIncome"
              @delete="handleDeleteIncome"
  ></IncomeList>
</template>
<script setup lang="ts">
import type {Income, IncomePartial} from "~/models/income/Income";

import {useApi} from "~/composables/useApi";

const incomes = ref<Income[]>([]);
const {get, create, update, list, remove} = useApi<Income>('incomes');
const loading = ref<boolean>(false);


async function handleCreateIncome(incomeTemplate: IncomePartial) {
  await create(incomeTemplate)
  await loadIncomes();
}

async function handleDeleteIncome(income: Income) {
  await remove(income.id)
  await loadIncomes();
}

async function handleUpdateIncome(income: Income) {
  await update(income.id, income)
  await loadIncomes();
}

async function loadIncomes() {
  try {
    incomes.value = await list();
  } catch (error) {
    console.error('Error loading incomes:', error);
  }
  loading.value = false;
}

onMounted(async () => {
  await loadIncomes()
})
</script>
