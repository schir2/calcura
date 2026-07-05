<!-- PROTOTYPE — shared Chart.js line for the EXPANDED view (axes/tooltip earn their weight here). -->
<script setup lang="ts">
import {CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip} from 'chart.js'
import {Line} from 'vue-chartjs'
import {fmtCurrency} from "./mock";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

type Props = { series: number[], hex: string, active?: boolean }
const props = withDefaults(defineProps<Props>(), {active: true})

const chartData = computed(() => ({
  labels: props.series.map((_, index) => 2024 + index),
  datasets: [{
    data: props.series,
    borderColor: props.active ? props.hex : '#888',
    backgroundColor: (props.active ? props.hex : '#888') + '22',
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
    tooltip: {
      callbacks: {label: (context: {parsed: {y: number}}) => fmtCurrency(context.parsed.y)},
    },
  },
  scales: {
    x: {grid: {display: false}, ticks: {maxTicksLimit: 6, color: '#9aa'}},
    y: {grid: {color: '#8882'}, ticks: {maxTicksLimit: 5, color: '#9aa', callback: (value: number) => '$' + (value / 1000) + 'k'}},
  },
}
</script>

<template>
  <div class="h-32 sm:h-40">
    <Line :data="chartData" :options="chartOptions as any"/>
  </div>
</template>