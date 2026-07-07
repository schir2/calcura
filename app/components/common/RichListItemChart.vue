<!-- Chart.js line for the expanded Rich List Item aside/chart zone (axes + tooltip earn
     their weight here, unlike the collapsed sparkline). Colour is resolved from the palette
     CSS var for the given model — no raw hex in the component. See ADR 008. -->
<script setup lang="ts">
import {CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip} from 'chart.js'
import {Line} from 'vue-chartjs'
import type {ModelName} from "#shared/types/ModelName"
import {resolveModelRgb} from "~/constants/ModelChartColor"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

type Props = {
  series: number[]
  modelName: ModelName
  active?: boolean
  startYear?: number
  baselineSeries?: number[]
}
const props = withDefaults(defineProps<Props>(), {active: true, startYear: new Date().getFullYear()})

const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')
const stroke = computed(() => resolveModelRgb(props.modelName, props.active))
const fill = computed(() => stroke.value.replace('rgb(', 'rgba(').replace(')', ', 0.13)'))
const baselineStroke = computed(() => stroke.value.replace('rgb(', 'rgba(').replace(')', ', 0.35)'))

const editedDataset = computed(() => ({
  data: props.series,
  borderColor: stroke.value,
  backgroundColor: fill.value,
  fill: true,
  tension: 0.3,
  pointRadius: 0,
  pointHoverRadius: 4,
  borderWidth: 2,
}))

// The frozen "saved plan" baseline (#107): dashed, faded, no fill, drawn beneath the edited line.
const baselineDataset = computed(() => ({
  data: props.baselineSeries ?? [],
  borderColor: baselineStroke.value,
  backgroundColor: 'transparent',
  fill: false,
  tension: 0.3,
  pointRadius: 0,
  pointHoverRadius: 3,
  borderWidth: 1.5,
  borderDash: [5, 4],
}))

const chartData = computed(() => ({
  labels: props.series.map((_, index) => props.startYear + index),
  datasets: props.baselineSeries?.length
      ? [baselineDataset.value, editedDataset.value]
      : [editedDataset.value],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {display: false},
    tooltip: {callbacks: {label: (context: {parsed: {y: number}}) => money(context.parsed.y)}},
  },
  scales: {
    x: {grid: {display: false}, ticks: {maxTicksLimit: 6}},
    y: {grid: {display: true}, ticks: {maxTicksLimit: 5, callback: (value: number) => '$' + (value / 1000) + 'k'}},
  },
}
</script>

<template>
  <div class="h-32 sm:h-40">
    <Line :data="chartData" :options="chartOptions as any"/>
  </div>
</template>
