<script setup lang="ts">
const route = useRoute()
const rothIraId = Number(route.params.id)
</script>
<template>
  <RothIraUpdateForm :id="rothIraId" @update="() => {}" @cancel="() => {}" />
</template>