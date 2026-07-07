<!-- Generic Rich List Item card — a dumb, reusable expandable ledger row. Owns LAYOUT only
     (collapsed row zones, collapse/expand mechanics, the expanded chart+aside scaffold,
     default edit/delete actions). Knows nothing about finance, models, or commands, so it
     can back any listing page. Callers fill the zones via slots.
     See app/components/common/CONTEXT.md. -->
<script setup lang="ts">
type Props = { expanded?: boolean }
withDefaults(defineProps<Props>(), {expanded: false})

defineEmits<{ toggle: []; edit: []; delete: [] }>()
</script>

<template>
  <div class="flex-1 min-w-0">
    <!-- collapsed ledger row — the left zone is click-to-edit; toggle + delete stay separate -->
    <div class="flex items-center gap-2 sm:gap-3 text-sm">
      <div
          class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-pointer rounded hover:bg-skin-surface-hover -mx-1 px-1 py-0.5 transition-colors"
          @click="$emit('edit')">
        <slot name="icon"/>
        <slot name="title"/>

        <span v-if="$slots.strategy"
              class="hidden sm:flex items-center gap-1 text-xs text-skin-muted border border-skin-base/20 rounded-full px-2 py-0.5 shrink-0">
          <slot name="strategy"/>
        </span>

        <span class="flex-1 min-w-0"/>

        <span class="shrink-0"><slot name="sparkline"/></span>

        <div class="text-right shrink-0 leading-tight"><slot name="headline"/></div>
      </div>

      <n-button size="tiny" quaternary class="shrink-0" @click="$emit('toggle')">
        <base-ico :name="expanded ? 'up' : 'down'" class="text-lg"/>
      </n-button>

      <slot name="actions">
        <list-item-buttons size="small" @delete="$emit('delete')"/>
      </slot>
    </div>

    <!-- expanded: wide chart zone + narrow aside zone (pure layout, finance-agnostic) -->
    <div v-if="expanded"
         class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-skin-base/20 mt-2 pt-3">
      <div class="sm:col-span-2 order-2 sm:order-1"><slot name="chart"/></div>
      <div class="order-1 sm:order-2"><slot name="aside"/></div>
    </div>
  </div>
</template>
