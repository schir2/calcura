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
import {useApi} from "~/composables/useApi";
const {get, create, update, list} = useApi<Income>('incomes');
const incomes = ref<Income[]>([]);
const incomeService = useIncomeService();

console.log(incomes.value)


async function handleCreateIncome(incomePartial: Partial<IncomePartial>) {
  await create(incomePartial)
  await refresh();
}

async function handleDeleteIncome(income: Income) {
  await incomeService.delete(income.id)
  await refresh();
}

async function handleUpdateIncome(income: Income) {
  await incomeService.update(income.id, income)
  await refresh();
}

onMounted(async () => {
  const {data, refresh} = await list()
  incomes.value = data.value

})

</script>
