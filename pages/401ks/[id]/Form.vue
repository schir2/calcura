<script setup lang="ts">
import type {TaxDeferredInvestment} from "~/types/TaxDeferredInvestment";

const route = useRoute()
const taxDeferredInvestmentId = Number(route.params.id)
const taxDeferredInvestment = ref<TaxDeferredInvestment | null>(null);
const taxDeferredInvestmentService = useTaxDeferredInvestmentService()
onMounted(async () => {
  if (taxDeferredInvestmentId) {
    taxDeferredInvestment.value = await taxDeferredInvestmentService.get(taxDeferredInvestmentId)
  }
})
</script>
<template>
  <TaxDeferredInvestmentForm v-if="taxDeferredInvestment" mode="view" :initialValues="taxDeferredInvestment"></TaxDeferredInvestmentForm>
</template>