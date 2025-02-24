<script setup lang="ts">
import type {Debt} from "~/types/Debt";

const route = useRoute()
const debtId = Number(route.params.id)
const debt = ref<Debt | null>(null);
const debtService = useDebtService()
onMounted(async () => {
  if (debtId) {
    debt.value = await debtService.get(debtId)
  }
})
</script>
<template>
  <DebtForm v-if="debt" mode="view" :initialValues="debt"></DebtForm>
</template>