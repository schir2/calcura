<script setup lang="ts">
// Stacked-area net-worth spine: asset bands + net-worth line + retirement marker.
import {Line} from 'vue-chartjs'
import {
  CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement,
  PointElement, Title, Tooltip,
} from 'chart.js'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import {chartCategoryHue} from '~/theme/palette'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

// `baselineStates` is the Workspace's snapshot-on-open comparison (#107 / ADR 015): the saved
// plan's trajectory, drawn as a dashed muted line behind the live edited one. Omitted on the
// Overview, where there is nothing to compare against.
const props = withDefaults(
  defineProps<{ states: OrchestratorState[]; baselineStates?: OrchestratorState[]; height?: number }>(),
  {height: 340},
)
const emit = defineEmits<{ categorySelect: [category: string] }>()
const {hue, ink} = useChartColors()

function netWorth(s: OrchestratorState): number {
  return s.assets.tax_deferred.balance_end + s.assets.taxable.balance_end +
    s.assets.tax_exempt.balance_end + s.assets.cash_reserve.balance_end +
    s.cash.net - s.liabilities.debt.balance_end
}

// bottom -> top of the stack; grouped by asset category per CONTEXT.md (never one band per account)
const bands = [
  {label: 'Un-invested Cash', category: 'cash', hue: chartCategoryHue.cash, get: (s: OrchestratorState) => s.cash.net},
  {label: 'Cash Reserve', category: 'cash_reserve', hue: chartCategoryHue.cash_reserve, get: (s: OrchestratorState) => s.assets.cash_reserve.balance_end},
  {label: 'Taxable', category: 'taxable', hue: chartCategoryHue.taxable, get: (s: OrchestratorState) => s.assets.taxable.balance_end},
  {label: 'Roth (Tax-Exempt)', category: 'tax_exempt', hue: chartCategoryHue.tax_exempt, get: (s: OrchestratorState) => s.assets.tax_exempt.balance_end},
  {label: 'Tax-Deferred', category: 'tax_deferred', hue: chartCategoryHue.tax_deferred, get: (s: OrchestratorState) => s.assets.tax_deferred.balance_end},
]

// 'cash' is un-invested cash — no entity to edit, so it is not a click target.
function selectBand(datasetIndex: number) {
  const band = bands[datasetIndex]
  if (!band || band.category === 'cash') return
  emit('categorySelect', band.category)
}

const labels = computed(() => props.states.map(s => `Age ${s.plan.age}`))
const retireIndex = computed(() => props.states.findIndex(s => s.retired))

const data = computed(() => ({
  labels: labels.value,
  datasets: [
    ...bands.map(band => ({
      label: band.label,
      data: props.states.map(band.get),
      backgroundColor: hue(band.hue, 0.82),
      borderColor: hue(band.hue, 1),
      borderWidth: 1,
      fill: true,
      stack: 'assets',
      pointRadius: 0,
      tension: 0.25,
    })),
    {
      label: 'Net Worth',
      data: props.states.map(netWorth),
      borderColor: hue('ink', 0.55),
      borderWidth: 1.5,
      fill: false,
      stack: 'networth',
      pointRadius: 0,
      tension: 0.25,
    },
    ...(props.baselineStates?.length
      ? [{
          label: 'Saved plan',
          data: props.baselineStates.map(netWorth),
          borderColor: hue('ink', 0.3),
          borderWidth: 1.5,
          borderDash: [5, 4],
          fill: false,
          stack: 'baseline',
          pointRadius: 0,
          tension: 0.25,
        }]
      : []),
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
  onClick: (event: any, _els: any, chart: any) => {
    const hit = chart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, false)
    if (hit.length) selectBand(hit[0].datasetIndex)
  },
  plugins: {
    legend: {
      labels: {color: ink('label'), usePointStyle: true, boxWidth: 8},
      onClick: (_e: any, item: any) => selectBand(item.datasetIndex),
    },
    tooltip: {callbacks: {label: (c: any) => `${c.dataset.label}: ${fmtUsdCompact(c.parsed.y)}`}},
  },
  scales: {
    x: {grid: {display: false}, ticks: {color: ink('muted'), maxRotation: 0, autoSkipPadding: 24}},
    y: {stacked: true, grid: {color: ink('grid', 0.5)}, ticks: {color: ink('muted'), callback: (v: any) => fmtUsdCompact(v)}},
  },
}))
</script>

<template>
  <div :style="{height: `${height}px`}">
    <Line :data="data" :options="options" :plugins="[retirementMarker]"/>
  </div>
</template>
