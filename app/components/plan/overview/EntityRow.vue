<script setup lang="ts">
// One row in an income-sources / accounts list (dot + name + amount).
const props = defineProps<{
  name: string
  amount: number
  suffix?: string
  hueName: 'blue' | 'green' | 'violet' | 'amber' | 'teal' | 'red' | 'slate'
}>()

const {hue} = useChartColors()
</script>

<template>
  <div class="flex items-center gap-2.5 rounded-lg border border-skin-base/40 bg-skin-surface
              px-3 py-2 mb-1.5 hover:bg-skin-surface-hover cursor-pointer transition-colors">
    <span class="w-2.5 h-2.5 rounded-sm flex-none" :style="{background: hue(hueName, 1)}"/>
    <span class="font-medium text-sm text-skin-base truncate">{{ name }}</span>
    <span class="ml-auto font-semibold text-sm text-skin-secondary tabular-nums">
      {{ fmtUsd(amount) }}<span v-if="suffix" class="text-skin-muted font-medium">{{ suffix }}</span>
    </span>
  </div>
</template>
