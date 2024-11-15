<template>
  <div class="col-span-4 space-y-6">
    <PlanRetirement/>
    <PlanTaxDeferredInvestment/>
  </div>
  <PlanSummary class="col-span-1"/>
</template>
<script setup lang="ts">
useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})
</script>