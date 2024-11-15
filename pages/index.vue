<template>
  <div class="grid grid-cols-3">
    <LayoutTheSidebar/>
    <div class="space-y-6">
      <RetirementProfile/>
      <RetirementTaxDeferredInvestment/>
    </div>
    <RetirementSummary/>
  </div>
</template>
<script setup lang="ts">
useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})
</script>