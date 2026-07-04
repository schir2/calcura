<script setup lang="ts">
import {darkTheme} from 'naive-ui'
import {Line} from 'vue-chartjs'
import {CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip} from 'chart.js'
import type {PlanProjection} from '~/composables/usePlanSimulations'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const {projection, loading = false, height = 130} = defineProps<{
    projection: PlanProjection
    loading?: boolean
    height?: number
}>()

const common = darkTheme.common
const depletes = computed(() => projection.depletionAge != null)
const lastAge = computed(() => projection.ages[projection.ages.length - 1])
const labels = computed(() => projection.ages.map(age => (age % 10 === 0 ? `${age}` : '')))

const data = computed(() => {
    const color = depletes.value ? common.errorColorHover : common.successColorHover
    const background = depletes.value ? 'rgba(208, 58, 82, 0.16)' : 'rgba(24, 160, 88, 0.15)'
    return {
        labels: labels.value,
        datasets: [{
            label: 'Balance',
            data: projection.lifetime,
            borderColor: color,
            backgroundColor: background,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 0,
        }],
    }
})

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {legend: {display: false}, tooltip: {enabled: false}},
    scales: {
        x: {grid: {display: false}, ticks: {color: common.textColor3, font: {size: 9}, maxRotation: 0}},
        y: {
            beginAtZero: true,
            ticks: {callback: (value: number) => `$${Math.round(Number(value) / 1000)}k`, color: common.textColor3, font: {size: 9}, maxTicksLimit: 3},
            grid: {color: 'rgba(255,255,255,0.06)'},
        },
    },
}
</script>

<template>
  <div class="w-full">
    <div :style="{ height: `${height}px` }">
      <Transition name="chart-fade" mode="out-in">
        <n-skeleton v-if="loading" key="sk" :height="`${height}px`" :sharp="false"/>
        <client-only v-else key="chart">
          <Line :data="data" :options="options"/>
        </client-only>
      </Transition>
    </div>
    <!-- headline insight: does the money outlast you? -->
    <p v-if="!loading" class="text-xs mt-1" :class="depletes ? 'text-skin-error' : 'text-skin-success'">
      <template v-if="depletes">⚠ Runs out at age {{ projection.depletionAge }}</template>
      <template v-else>✓ Lasts through age {{ lastAge }}</template>
    </p>
  </div>
</template>

<style scoped>
.chart-fade-enter-active,
.chart-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.chart-fade-leave-to {
  opacity: 0;
}
</style>