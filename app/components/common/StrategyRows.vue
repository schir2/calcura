<script setup lang="ts">
// Canonical strategy-input control (ADR 011): vertical radio rows in a bordered
// list; the selected row highlights and reveals its field(s) inline via a slot
// named after the option value. Replaces CommonRadioCard for strategy selection.
type Option = {value: string; label: string; hint?: string}
defineProps<{options: Option[]}>()
const model = defineModel<string | null>()
</script>

<template>
  <div class="rounded-lg border border-skin-base divide-y divide-skin-base overflow-hidden">
    <div :key="opt.value" v-for="opt in options" :class="model === opt.value ? 'bg-skin-surface-hover' : ''">
      <label class="flex items-start gap-3 p-3 cursor-pointer">
        <n-radio class="mt-0.5" :checked="model === opt.value" @change="model = opt.value"/>
        <span class="min-w-0">
          <span class="text-sm text-skin-base">{{ opt.label }}</span>
          <span v-if="opt.hint" class="block text-xs text-skin-muted">{{ opt.hint }}</span>
        </span>
      </label>
      <div v-if="model === opt.value && $slots[opt.value]" class="px-4 pb-4">
        <slot :name="opt.value"/>
      </div>
    </div>
  </div>
</template>
