<template>
  <n-skeleton v-if="loading" text :repeat="2"/>
  <IncomeList v-else :incomes="incomes"
              @create="handleCreateIncome"
              @update="handleUpdateIncome"
              @delete="handleDeleteIncome"
  ></IncomeList>
</template>
<script setup lang="ts">
import type {Income, IncomeInsert, IncomeUpdate} from "#shared/types/Income";

const incomes = ref<Income[]>([]);
const {create, update, list, remove} = useIncomeService();
const loading = ref<boolean>(false);


async function handleCreateIncome(insert: IncomeInsert) {
  await create(insert)
  await loadIncomes();
}

async function handleDeleteIncome(id: number) {
  await remove(id)
  await loadIncomes();
}

async function handleUpdateIncome(id: number, update: IncomeUpdate) {
  await update(id, update)
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
