<template>
  <IncomeList :incomes="incomeStore.list"
              @create="handleCreateIncome"
              @update="handleUpdateIncome"
              @delete="handleDeleteIncome"
  ></IncomeList>
</template>
<script setup lang="ts">
import type {IncomeInsert, IncomeUpdate} from "#shared/types/Income";

const incomeStore = useIncomeStore()

onMounted(() => incomeStore.fetchAll())

async function handleCreateIncome(insert: IncomeInsert) {
  await incomeStore.create(insert)
}

async function handleDeleteIncome(id: number) {
  await incomeStore.purge(id)
}

async function handleUpdateIncome(id: number, update: IncomeUpdate) {
  await incomeStore.patch(id, update)
}
</script>