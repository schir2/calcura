<script setup lang="ts">

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
</script>
<template>
  <div v-if="income" class="col-span-4 space-y-6">
    hi
  </div>
</template>