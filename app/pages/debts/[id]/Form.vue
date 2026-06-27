<script setup lang="ts">
const route = useRoute()
const debtId = Number(route.params.id)

const debtStore = useDebtStore()
const debt = computed(() => debtStore.get(debtId))

onMounted(() => {
  if (debtId) debtStore.fetch(debtId)
})
</script>
<template>
  <DebtForm v-if="debt" mode="view" :initialValues="debt"></DebtForm>
</template>