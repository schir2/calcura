<template>
  <n-space>
    <n-button @click="handleStart">
      start
    </n-button>
    <n-button :disabled="disabled" @click="handleFinish">
      finish
    </n-button>
    <n-button @click="handleError">
      error
    </n-button>
  </n-space>
</template>
<script lang="ts" setup>
</script>