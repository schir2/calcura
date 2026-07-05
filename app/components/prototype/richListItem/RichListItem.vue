<!-- PROTOTYPE — the chosen design: "Compact" dense ledger row + shared expanded side-panel.
     Responsive: value+label stack (no fixed widths), strategy chip hides on narrow screens,
     expanded panel stacks chart-over-config on mobile. Fold into command/ListItem.vue when done. -->
<script setup lang="ts">
import type {MockItem} from "./mock";
import {fmtCurrency} from "./mock";
import Sparkline from "./Sparkline.vue";
import ExpandedPanel from "./ExpandedPanel.vue";

type Props = { item: MockItem, expanded: boolean }
const props = defineProps<Props>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="rounded border border-skin-base/20 bg-skin-surface transition"
       :class="{ 'opacity-40 grayscale': !item.is_active }">
    <div class="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 text-sm">
      <base-ico :name="item.icon" :class="item.tone" class="text-xl shrink-0"/>
      <span class="font-medium truncate min-w-0">{{ item.name }}</span>
      <span class="hidden sm:flex items-center gap-1 text-xs text-skin-muted border border-skin-base/20 rounded-full px-2 py-0.5 shrink-0">
        <base-ico v-if="item.strategy.icon" :name="item.strategy.icon"/>
        {{ item.strategy.label }}
      </span>

      <span class="flex-1 min-w-0"/>

      <Sparkline :series="item.series" :active="item.is_active" :tone="item.tone"
                 :width="56" :height="22" class="shrink-0"/>

      <!-- value + label stacked: no fixed widths, so it never overflows on mobile -->
      <div class="text-right shrink-0 leading-tight">
        <div class="tabular-nums font-semibold" :class="item.tone">
          {{ item.sign }}{{ fmtCurrency(item.headlineValue) }}
        </div>
        <div class="text-[10px] text-skin-muted">{{ item.headlineLabel }}</div>
      </div>

      <n-button size="tiny" quaternary @click="$emit('toggle')" class="shrink-0">
        <base-ico :name="expanded ? 'up' : 'down'" class="text-lg"/>
      </n-button>
      <base-ico name="more" class="text-lg text-skin-muted cursor-pointer shrink-0"/>
    </div>

    <ExpandedPanel v-if="expanded" :item="item"/>
  </div>
</template>
