<script setup lang="ts">
// PROTOTYPE — issue #94. Income vs. expenses over time.
import {Line} from 'vue-chartjs'
import {
  CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement,
  PointElement, Title, Tooltip,
} from 'chart.js'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import {fmtUsdCompact, usePrototypeSkin} from '../usePrototypeSkin'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const props = withDefaults(defineProps<{ states: OrchestratorState[]; height?: number }>(), {height: 240})
const {hue, ink} = usePrototypeSkin()

const labels = computed(() => props.states.map(s => `Age ${s.plan.age}`))

const data = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Gross Income',
      data: props.states.map(s => s.income.gross),
      borderColor: hue('green', 1),
      backgroundColor: hue('green', 0.13),
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      tension: 0.25,
    },
    {
      label: 'Expenses + Debt',
      data: props.states.map(s => s.liabilities.expense.paid + s.liabilities.debt.paid),
      borderColor: hue('red', 1),
      backgroundColor: hue('red', 0.15),
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      tension: 0.25,
    },
    {
      label: 'Net Income',
      data: props.states.map(s => s.income.net),
      borderColor: hue('blue', 0.9),
      borderWidth: 1.5,
      borderDash: [4, 3],
      fill: false,
      pointRadius: 0,
      tension: 0.25,
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
    <Line :data="data" :options="options"/>
  </div>
</template>
