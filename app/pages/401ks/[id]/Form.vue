<script setup lang="ts">
const route = useRoute()
const taxDeferredId = Number(route.params.id)
</script>
<template>
  <TaxDeferredUpdateForm :id="taxDeferredId" @update="() => {}" @cancel="() => {}" />
</template>