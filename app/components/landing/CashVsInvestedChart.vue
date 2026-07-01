<!-- Landing chart: the same $100k in a bank vs. invested, after inflation, in today's dollars. -->
<template>
  <n-card size="small" :bordered="true">
    <template #header>
      <span class="text-xl md:text-2xl font-semibold text-skin-base">
        Your money in an investment <span class="text-skin-success">(7% / year)</span>
      </span>
      <div class="text-xs text-skin-muted mt-0.5">shown in today's dollars, after ~{{ INFLATION * 100 }}% inflation</div>
    </template>

    <div class="flex flex-col gap-3">
      <!-- Big impact stat, centered above the chart -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold leading-none text-skin-success">
          +{{ formatUSD(gapAt30) }}
        </div>
        <div class="text-xl md:text-2xl font-semibold text-skin-success/80 mt-1">+{{ gapPct }}%</div>
        <div class="text-skin-muted text-sm mt-1">more over 30 years, in today's dollars</div>
      </div>

      <!-- Chart + control -->
      <div class="grow min-w-0">
        <client-only>
          <Line :data="chartData" :options="options" />
        </client-only>
        <div class="flex items-center justify-end mt-3">
          <n-switch v-model:value="showTax" size="small">
            <template #checked>Tax impact</template>
            <template #unchecked>Tax impact</template>
          </n-switch>
        </div>
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
const CONTRIB = 0 // lump sum, matching the bank-account chart for a fair comparison
const YEARS = 30
const INFLATION = 0.03 // matches the "typical inflation" line on the bank-account chart (long-run US average)

const showTax = ref(false)

const formatUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(n)

// Convert a nominal return into a real (after-inflation) return, so every line is in today's dollars.
const real = (nominal: number) => (1 + nominal) / (1 + INFLATION) - 1

function project(nominalRate: number) {
  const rate = real(nominalRate)
  const out: number[] = []
  let bal = PRINCIPAL
  for (let y = 0; y <= YEARS; y++) {
    if (y > 0) bal = bal * (1 + rate) + CONTRIB
    out.push(bal)
  }
  return out
}

const bank = computed(() => project(0.005))     // ~0.5% savings → negative in real terms
const invested = computed(() => project(0.07))  // ~7% market → ~4.4% real
const taxDeferred = computed(() => project(0.07))
const taxable = computed(() => project(0.055))

const gapAt30 = computed(() => invested.value[YEARS] - bank.value[YEARS])
const gapPct = computed(() => Math.round((gapAt30.value / PRINCIPAL) * 100))

const chartData = computed(() => {
  const datasets: any[] = [
    {
      label: 'Bank account',
      data: bank.value,
      borderColor: darkTheme.common.textColor3,
      pointRadius: 0,
      borderWidth: 2,
      tension: 0.3,
      fill: false,
    },
  ]
  if (showTax.value) {
    datasets.push(
      {
        label: 'Tax-deferred (401k/IRA)',
        data: taxDeferred.value,
        borderColor: darkTheme.common.infoColorHover,
        pointRadius: 0,
        borderWidth: 3,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Taxable brokerage',
        data: taxable.value,
        borderColor: darkTheme.common.warningColorHover,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 4],
        tension: 0.3,
        fill: false,
      },
    )
  } else {
    datasets.push({
      label: 'Invested',
      data: invested.value,
      borderColor: darkTheme.common.successColorHover,
      backgroundColor: 'rgba(24, 160, 88, 0.18)',
      fill: '-1', // shade the GAIN wedge between bank and invested
      pointRadius: 0,
      borderWidth: 3,
      tension: 0.3,
    })
  }
  return {labels: Array.from({length: YEARS + 1}, (_, y) => (y % 5 === 0 ? `Yr ${y}` : '')), datasets}
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {intersect: false, mode: 'index' as const},
  plugins: {
    legend: {display: true, position: 'top' as const, labels: {color: darkTheme.common.textColor2, boxHeight: 8, usePointStyle: true}},
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
