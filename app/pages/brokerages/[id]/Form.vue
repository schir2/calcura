<script setup lang="ts">
const route = useRoute()
const brokerageId = Number(route.params.id)
</script>
<template>
  <BrokerageUpdateForm :id="brokerageId" @update="() => {}" @cancel="() => {}" />
</template>