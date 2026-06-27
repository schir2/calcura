<script setup lang="ts">
const route = useRoute()
const debtId = Number(route.params.id)
</script>
<template>
  <DebtUpdateForm :id="debtId" @update="() => {}" @cancel="() => {}" />
</template>