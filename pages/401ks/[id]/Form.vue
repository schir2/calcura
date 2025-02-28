<script setup lang="ts">
import type {TaxDeferred} from "~/types/TaxDeferred";

const route = useRoute()
const taxDeferredInvestmentId = Number(route.params.id)
const taxDeferredInvestment = ref<TaxDeferred | null>(null);
const taxDeferredInvestmentService = useTaxDeferredInvestmentService()
onMounted(async () => {
  if (taxDeferredInvestmentId) {
    taxDeferredInvestment.value = await taxDeferredInvestmentService.get(taxDeferredInvestmentId)
  }
})
</script>
<template>
  <TaxDeferredForm v-if="taxDeferredInvestment" mode="view" :initialValues="taxDeferredInvestment"></TaxDeferredForm>
</template>