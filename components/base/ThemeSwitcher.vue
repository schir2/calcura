<script lang="ts" setup>
const themeStore = useThemeStore()
const {theme} = storeToRefs(themeStore)
</script>
<template>
  <n-button circle v-if="theme === 'dark'" @click="themeStore.toggleTheme()">
    <template #icon><base-ico class="text-purple-500" name="darkTheme"/></template>
  </n-button>
  <n-button circle v-else @click="themeStore.toggleTheme()">
    <template #icon><base-ico class="text-yellow-500" name="lightTheme"/></template>
  </n-button>
</template>