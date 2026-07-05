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
}
const props = withDefaults(defineProps<Props>(), {active: true, startYear: new Date().getFullYear()})

const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')
const stroke = computed(() => resolveModelRgb(props.modelName, props.active))
const fill = computed(() => stroke.value.replace('rgb(', 'rgba(').replace(')', ', 0.13)'))

const chartData = computed(() => ({
  labels: props.series.map((_, index) => props.startYear + index),
  datasets: [{
    data: props.series,
    borderColor: stroke.value,
    backgroundColor: fill.value,
    fill: true,
    tension: 0.3,
    pointRadius: 0,
    pointHoverRadius: 4,
    borderWidth: 2,
  }],
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
