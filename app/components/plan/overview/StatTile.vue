<script setup lang="ts">
// Small KPI tile for the Overview stat row.
withDefaults(defineProps<{
  label: string
  value: string
  hint?: string
  tone?: 'base' | 'success' | 'error' | 'info' | 'warning'
}>(), {tone: 'base'})

const toneClass: Record<string, string> = {
  base: 'text-skin-base',
  success: 'text-skin-success',
  error: 'text-skin-error',
  info: 'text-skin-info',
  warning: 'text-skin-warning',
}
</script>

<template>
  <div class="px-4 py-3 rounded-lg bg-skin-muted/60 border border-skin-base/40">
    <div class="text-xs uppercase tracking-wide text-skin-muted">{{ label }}</div>
    <div class="text-2xl font-semibold leading-tight mt-1" :class="toneClass[tone]">{{ value }}</div>
    <div v-if="hint" class="text-xs text-skin-muted mt-0.5">{{ hint }}</div>
  </div>
</template>