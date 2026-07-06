<script setup lang="ts">
// Projected retirement income (given trajectory) vs. the income goal.
import {Line} from 'vue-chartjs'
import {
  CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement,
  PointElement, Title, Tooltip,
} from 'chart.js'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const props = withDefaults(defineProps<{ states: OrchestratorState[]; height?: number }>(), {height: 240})
const {hue, ink} = useChartColors()

const retireIndex = computed(() => props.states.findIndex(s => s.retired))

const data = computed(() => ({
  labels: props.states.map(s => `Age ${s.plan.age}`),
  datasets: [
    {
      label: 'Projected retirement income',
      data: props.states.map(s => s.plan.retirement_income_projected),
      borderColor: hue('green', 1),
      backgroundColor: hue('green', 0.13),
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      tension: 0.25,
    },
    {
      label: 'Income goal',
      data: props.states.map(s => s.plan.retirement_income_goal),
      borderColor: hue('slate', 0.9),
      borderWidth: 1.5,
      borderDash: [5, 4],
      fill: false,
      pointRadius: 0,
      tension: 0,
    },
  ],
}))

const retirementMarker = {
  id: 'retirementMarker',
  afterDatasetsDraw(chart: any) {
    const i = retireIndex.value
    if (i < 0) return
    const x = chart.scales.x.getPixelForValue(i)
    const {top, bottom} = chart.chartArea
    const ctx = chart.ctx
    ctx.save()
    ctx.strokeStyle = hue('green', 0.9)
    ctx.setLineDash([4, 3])
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x, bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = hue('green', 1)
    ctx.font = '600 11px sans-serif'
    ctx.textAlign = x > chart.width / 2 ? 'right' : 'left'
    ctx.fillText('  Retirement  ', x, top + 12)
    ctx.restore()
  },
}

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
    <Line :data="data" :options="options" :plugins="[retirementMarker]"/>
  </div>
</template>
