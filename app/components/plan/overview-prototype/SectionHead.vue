<script setup lang="ts">
// PROTOTYPE — issue #94. Section header: colored dot + prominent title + rule + "Add" pill.
withDefaults(defineProps<{
  title: string
  tag?: string
  addLabel?: string
  dotClass?: string
}>(), {dotClass: 'bg-skin-info'})

defineEmits<{ add: [] }>()
</script>

<template>
  <div class="flex items-center gap-3 mt-6 mb-2 px-0.5">
    <span class="w-2.5 h-2.5 rounded-full flex-none" :class="dotClass"/>
    <h2 class="text-lg font-semibold tracking-tight text-skin-base">{{ title }}</h2>
    <span v-if="tag" class="text-xs text-skin-muted font-medium hidden sm:inline">{{ tag }}</span>
    <span class="flex-1 border-t border-skin-base"/>
    <slot name="action">
      <button
          v-if="addLabel"
          type="button"
          class="rounded-full border border-skin-primary text-skin-primary bg-skin-primary/10
                 text-xs font-semibold px-3 py-1 hover:border-dashed hover:bg-skin-primary/20
                 transition-colors"
          @click="$emit('add')">
        ＋ {{ addLabel }}
      </button>
    </slot>
  </div>
</template>
