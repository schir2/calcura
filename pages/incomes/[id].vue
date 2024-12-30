<template>
  <div v-if="income" class="col-span-4 space-y-6">
    hi
  </div>
</template>
<script setup lang="ts">
import type {Income} from "~/models/income/Income";

const route = useRoute()
const incomeId = Number(route.params.id)
const income = ref<Income | null>(null)

const incomeService = useIncomeService()
const loading = ref<boolean>(false);

async function handleDeleteIncome(income: Income) {
  await incomeService.delete(income.id)
  await loadIncome();
}

async function handleUpdateIncome(income: Income) {
  await incomeService.update(income.id, income)
  await loadIncome();
}

async function loadIncome() {
  try {
    income.value = await incomeService.get(incomeId)
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadIncome();
  useHead({
    title: `Income: ${income.value.name}`,
    meta: [
      {name: 'description', content: 'Calcura: Dashboard'}
    ],
  })
});


</script>