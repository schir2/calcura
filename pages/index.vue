<template>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options" />
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>
    <PlanIncome :showAdvancedOptions="showAdvancedOptions"></PlanIncome>
    <PlanTaxDeferredInvestment :showAdvancedOptions="showAdvancedOptions"/>
  </div>
  <PlanSummary class="col-span-1"/>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})
const showAdvancedOptions = ref<boolean>(false)
</script>