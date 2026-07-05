<!-- PROTOTYPE — Variant A: "Compact" (dense ledger row). Bank-statement hierarchy:
     name-led, value right-aligned, trailing sparkline. Expands to the shared side-panel view. -->
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
    <div class="flex items-center gap-3 px-3 py-2 text-sm">
      <base-ico :name="item.icon" :class="item.tone" class="text-xl shrink-0"/>
      <span class="font-medium truncate">{{ item.name }}</span>
      <span class="flex items-center gap-1 text-xs text-skin-muted border border-skin-base/20 rounded-full px-2 py-0.5 shrink-0">
        <base-ico v-if="item.strategy.icon" :name="item.strategy.icon"/>
        {{ item.strategy.label }}
      </span>

      <span class="flex-1"/>

      <Sparkline :series="item.series" :active="item.is_active" :tone="item.tone" :width="64" :height="22"/>
      <span class="tabular-nums font-semibold w-28 text-right" :class="item.tone">
        {{ item.sign }}{{ fmtCurrency(item.headlineValue) }}
      </span>
      <span class="text-[10px] text-skin-muted w-20 leading-tight">{{ item.headlineLabel }}</span>

      <n-button size="tiny" quaternary @click="$emit('toggle')">
        <base-ico :name="expanded ? 'up' : 'down'" class="text-lg"/>
      </n-button>
      <base-ico name="more" class="text-lg text-skin-muted cursor-pointer"/>
    </div>

    <ExpandedPanel v-if="expanded" :item="item"/>
  </div>
</template>