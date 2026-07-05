<!-- PROTOTYPE — shared expanded body: Chart.js graph (left) + config/stats side panel (right).
     This is "A's expanded view" the user liked; reused by both density variants. -->
<script setup lang="ts">
import type {MockItem} from "./mock";
import {fmtCurrency} from "./mock";
import ExpandedChart from "./ExpandedChart.vue";

type Props = { item: MockItem }
const props = defineProps<Props>()

const stats = computed(() => {
  const series = props.item.series
  return [
    {label: 'Today', value: fmtCurrency(series[0]!)},
    {label: props.item.headlineLabel, value: props.item.sign + fmtCurrency(props.item.headlineValue)},
  ]
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-skin-base/20 px-3 py-3">
    <div class="sm:col-span-2 order-2 sm:order-1">
      <ExpandedChart :series="item.series" :hex="item.hex" :active="item.is_active"/>
    </div>
    <div class="flex flex-col gap-3 text-xs order-1 sm:order-2">
      <div>
        <span class="text-skin-muted uppercase tracking-wide text-[10px]">Projection</span>
        <div v-for="stat in stats" :key="stat.label" class="flex justify-between mt-1">
          <span class="text-skin-muted capitalize">{{ stat.label }}</span>
          <span class="tabular-nums font-medium" :class="item.tone">{{ stat.value }}</span>
        </div>
      </div>
      <div>
        <span class="text-skin-muted uppercase tracking-wide text-[10px]">Configuration</span>
        <div v-for="facet in item.facets" :key="facet.label" class="flex items-center gap-1.5 mt-1">
          <base-ico v-if="facet.icon" :name="facet.icon" :class="item.tone"/>
          {{ facet.label }}
        </div>
      </div>
      <span class="mt-auto flex items-center gap-1 text-skin-info/70 cursor-not-allowed">
        <base-ico name="info"/> What is a {{ item.name }}? <span class="text-[10px]">(soon)</span>
      </span>
    </div>
  </div>
</template>