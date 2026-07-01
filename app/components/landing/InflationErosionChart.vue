<!-- Landing chart: purchasing power of bank cash under no / typical / high inflation, in today's dollars. -->
<template>
  <n-card size="small" :bordered="true">
    <template #header>
      <span class="text-xl md:text-2xl font-semibold text-skin-base">
        Your money in a bank account <span class="text-skin-muted">(0.5% / year)</span>
      </span>
      <div class="text-xs text-skin-muted mt-0.5">shown in today's dollars</div>
    </template>

    <div class="flex flex-col gap-3">
      <!-- Big impact stat, centered above the chart -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold leading-none text-skin-error">−{{ formatUSD(lostHigh) }}</div>
        <div class="text-xl md:text-2xl font-semibold text-skin-error/80 mt-1">−{{ lostPct }}%</div>
        <div class="text-skin-muted text-sm mt-1">of buying power gone to <span class="text-skin-error font-medium">5% inflation</span> in 30 years</div>
      </div>

      <!-- Chart -->
      <div class="grow min-w-0">
        <client-only>
          <Line :data="chartData" :options="options" />
        </client-only>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {darkTheme} from "naive-ui"
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

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const PRINCIPAL = 100_000
const YEARS = 30
const BANK_RATE = 0.005 // 0.5% savings interest, matching the investment chart's bank line

const formatUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(n)

// Balance in today's dollars: 0.5% nominal interest, discounted by the given inflation rate.
const series = (inflation: number) => {
  const realRate = (1 + BANK_RATE) / (1 + inflation) - 1
  return Array.from({length: YEARS + 1}, (_, y) => PRINCIPAL * Math.pow(1 + realRate, y))
}

const lostHigh = computed(() => PRINCIPAL - series(0.05)[YEARS])
const lostPct = computed(() => Math.round((lostHigh.value / PRINCIPAL) * 100))

const chartData = computed(() => ({
  labels: Array.from({length: YEARS + 1}, (_, y) => (y % 5 === 0 ? `Yr ${y}` : '')),
  datasets: [
    {
      label: 'No inflation',
      data: series(0),
      borderColor: darkTheme.common.successColorHover,
      borderDash: [6, 6],
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
      tension: 0,
    },
    {
      label: 'Typical inflation (3%)',
      data: series(0.03),
      borderColor: darkTheme.common.warningColorHover,
      fill: false,
      pointRadius: 0,
      borderWidth: 2.5,
      tension: 0.3,
    },
    {
      label: 'High inflation (5%)',
      data: series(0.05),
      borderColor: darkTheme.common.errorColorHover,
      backgroundColor: 'rgba(208, 58, 82, 0.20)',
      fill: {target: 0}, // shade the loss vs. "no inflation"
      pointRadius: 0,
      borderWidth: 3,
      tension: 0.3,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {intersect: false, mode: 'index' as const},
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {color: darkTheme.common.textColor2, boxHeight: 8, usePointStyle: true},
    },
    tooltip: {
      callbacks: {label: (ctx: any) => `${ctx.dataset.label}: ${formatUSD(ctx.parsed.y)}`},
      backgroundColor: darkTheme.common.popoverColor,
      titleColor: darkTheme.common.textColorBase,
      bodyColor: darkTheme.common.textColorBase,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {callback: (v: any) => `$${Math.round(v / 1000)}k`, color: darkTheme.common.textColor3},
      grid: {color: 'rgba(255,255,255,0.06)'},
    },
    x: {grid: {display: false}, ticks: {color: darkTheme.common.textColor3}},
  },
}
</script>

<style scoped>
:deep(canvas) {
  height: 240px !important;
}
</style>
