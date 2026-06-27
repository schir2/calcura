<script lang="ts" setup>
const { colorMode, toggleColorMode } = useNaiveColorMode()
</script>
<template>
  <n-button circle v-if="colorMode === 'dark'" @click="toggleColorMode()">
    <template #icon><base-ico class="text-purple-500" name="darkTheme"/></template>
  </n-button>
  <n-button circle v-else @click="toggleColorMode()">
    <template #icon><base-ico class="text-yellow-500" name="lightTheme"/></template>
  </n-button>
</template>