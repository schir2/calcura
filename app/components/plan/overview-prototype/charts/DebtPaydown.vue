<script setup lang="ts">
// PROTOTYPE — issue #94. Debt paydown: declining balance with cumulative-interest shading.
import {Line} from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import {fmtUsdCompact, usePrototypeSkin} from '../usePrototypeSkin'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const props = withDefaults(defineProps<{ states: OrchestratorState[]; height?: number }>(), {height: 240})
const {hue, ink} = usePrototypeSkin()

const hasDebt = computed(() => props.states.some(s => s.liabilities.debt.balance_end > 0 || s.liabilities.debt.paid_lifetime > 0))

const data = computed(() => ({
  labels: props.states.map(s => `Age ${s.plan.age}`),
  datasets: [
    {
      label: 'Debt Balance',
      data: props.states.map(s => s.liabilities.debt.balance_end),
      borderColor: hue('red', 1),
      backgroundColor: hue('red', 0.16),
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      tension: 0.2,
    },
    {
      label: 'Cumulative Interest',
      data: props.states.map(s => s.liabilities.debt.interest_accrued_lifetime),
      borderColor: hue('red', 0.45),
      backgroundColor: hue('red', 0.1),
      borderWidth: 1.5,
      borderDash: [4, 3],
      fill: 'origin',
      pointRadius: 0,
      tension: 0.2,
    },
  ],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {mode: 'index' as const, intersect: false},
  plugins: {
    legend: {labels: {color: ink('label'), usePointStyle: true, boxWidth: 8}},
    tooltip: {callbacks: {label: (c: any) => `${c.dataset.label}: ${fmtUsdCompact(c.parsed.y)}`}},
  },
  scales: {
    x: {grid: {display: false}, ticks: {color: ink('muted'), maxRotation: 0, autoSkipPadding: 24}},
    y: {grid: {color: ink('grid', 0.5)}, ticks: {color: ink('muted'), callback: (v: any) => fmtUsdCompact(v)}},
  },
}))
</script>

<template>
  <div :style="{height: `${height}px`}">
    <Line v-if="hasDebt" :data="data" :options="options"/>
    <div v-else class="h-full flex items-center justify-center text-skin-muted text-sm">
      No debt in this plan — nothing to pay down.
    </div>
  </div>
</template>