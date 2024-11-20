<script setup lang="ts">

</script>

<template>
  <div class="p-6 rounded-lg shadow-md bg-skin-surface">
    <div v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <slot/>
    <div v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<style scoped>

</style>