<script setup lang="ts">

</script>

<template>
  <n-card>
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>
    <slot/>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </n-card>
</template>

<style scoped>

</style>
