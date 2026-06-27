<template>
  <div v-if="income" class="col-span-4 space-y-6">
    hi
  </div>
</template>
<script setup lang="ts">
import type {Income} from "#shared/types/Income";

const route = useRoute()
const incomeId = Number(route.params.id)

const incomeStore = useIncomeStore()
const income = computed(() => incomeStore.get(incomeId))

onMounted(async () => {
  await incomeStore.fetch(incomeId)
  useHead({
    title: `Income: ${income.value?.name ?? ''}`,
    meta: [
      {name: 'description', content: 'Calcura: Dashboard'}
    ],
  })
})

async function handleDeleteIncome(inc: Income) {
  await incomeStore.purge(inc.id)
}

async function handleUpdateIncome(inc: Income) {
  await incomeStore.patch(inc.id, inc)
}
</script>