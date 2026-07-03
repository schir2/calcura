<script lang="ts" setup>
import {tools} from '~/constants/tools'

definePageMeta({
  title: 'Calcura Dashboard',
  layout: 'default',
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 space-y-8 py-6">
    <header class="space-y-1">
      <h1 class="text-4xl">Dashboard</h1>
      <p class="text-skin-muted text-lg">Pick a tool to get started.</p>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DashboardToolCard v-for="tool in tools" :key="tool.id" :tool="tool"/>
    </div>
  </div>
</template>