<template>
  <NConfigProvider :theme="darkTheme">
    <main data-theme="dark">
      <slot></slot>
    </main>
  </NConfigProvider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
</script>