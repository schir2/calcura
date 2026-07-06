<script setup lang="ts">
// Expense composition, working vs. retirement, split on the two independent axes
// (essential/discretionary × fixed/variable). Amounts in today's dollars from expense config:
//  - working:    is_retirement_only ? 0 : base
//  - retirement: base × retirement_spending_percentage  (picks up retirement-only expenses)
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip} from 'chart.js'
import type {Expense} from '#shared/types/Expense'

ChartJS.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = withDefaults(defineProps<{ expenses?: Expense[]; height?: number }>(), {expenses: () => [], height: 170})
const {hue, ink} = useChartColors()

const segments = [
  {label: 'Essential · fixed', hue: 'blue' as const, essential: true, type: 'fixed'},
  {label: 'Essential · variable', hue: 'teal' as const, essential: true, type: 'variable'},
  {label: 'Discretionary · fixed', hue: 'amber' as const, essential: false, type: 'fixed'},
  {label: 'Discretionary · variable', hue: 'violet' as const, essential: false, type: 'variable'},
]

function bucketSums(getAmount: (e: Expense) => number) {
  return segments.map(seg =>
    props.expenses
      .filter(e => e.is_essential === seg.essential && e.expense_type === seg.type)
      .reduce((sum, e) => sum + getAmount(e), 0))
}

const working = computed(() => bucketSums(e => e.is_retirement_only ? 0 : getAnnualAmount(e.amount, e.frequency)))
const retirement = computed(() => bucketSums(e => getAnnualAmount(e.amount, e.frequency) * (e.retirement_spending_percentage ?? 100) / 100))

const workingTotal = computed(() => working.value.reduce((a, b) => a + b, 0))
const retirementTotal = computed(() => retirement.value.reduce((a, b) => a + b, 0))
const hasData = computed(() => Math.max(workingTotal.value, retirementTotal.value) > 0)

const pctChange = computed(() => {
  if (!workingTotal.value) return null
  return Math.round((retirementTotal.value - workingTotal.value) / workingTotal.value * 100)
})

const data = computed(() => ({
  labels: ['While working', 'In retirement'],
  datasets: segments.map((seg, i) => ({
    label: seg.label,
    data: [working.value[i] ?? 0, retirement.value[i] ?? 0],
    backgroundColor: hue(seg.hue, 0.85),
    borderWidth: 0,
    stack: 'spend',
    barThickness: 30,
  })),
}))

const options = computed(() => ({
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {position: 'bottom' as const, labels: {color: ink('label'), usePointStyle: true, boxWidth: 8, padding: 12}},
    tooltip: {callbacks: {
      label: (c: any) => `${c.dataset.label}: ${fmtUsdCompact(c.parsed.x)}`,
      footer: (items: any[]) => `Total: ${fmtUsd(items[0]?.dataIndex === 0 ? workingTotal.value : retirementTotal.value)}/yr`,
    }},
  },
  scales: {
    x: {stacked: true, grid: {display: false}, ticks: {color: ink('muted'), callback: (v: any) => fmtUsdCompact(v)}},
    y: {stacked: true, grid: {display: false}, ticks: {color: ink('label')}},
  },
}))
</script>

<template>
  <div>
    <div :style="{height: `${height}px`}">
      <Bar v-if="hasData" :data="data" :options="options"/>
      <div v-else class="h-full flex items-center justify-center text-skin-muted text-sm">
        No expenses added yet.
      </div>
    </div>
    <p v-if="hasData" class="text-xs text-skin-muted mt-1 px-0.5">
      Today's dollars.
      <template v-if="pctChange != null">
        Spending
        <span :class="pctChange <= 0 ? 'text-skin-success' : 'text-skin-warning'" class="font-semibold">{{ pctChange <= 0 ? 'drops' : 'rises' }} {{ Math.abs(pctChange) }}%</span>
        in retirement.
      </template>
    </p>
  </div>
</template>
