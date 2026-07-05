<!-- Generic inline SVG sparkline. Colour comes from a skin text token via currentColor
     (theme-aware, no raw hex); greys when inactive. Reusable anywhere a tiny trend line
     is useful — not tied to list items or commands. -->
<script setup lang="ts">
type Props = {
  series: number[]
  active?: boolean
  tone?: string
  width?: number
  height?: number
  fill?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  active: true, tone: 'text-skin-primary', width: 56, height: 22, fill: false,
})

const geometry = computed(() => {
  const series = props.series.length ? props.series : [0, 0]
  const count = series.length
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const pad = 2
  const points = series.map((value, index) => {
    const x = pad + (index / Math.max(1, count - 1)) * (props.width - 2 * pad)
    const y = props.height - pad - ((value - min) / span) * (props.height - 2 * pad)
    return {x, y}
  })
  const line = points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
  const area = `${pad},${props.height - pad} ${line} ${props.width - pad},${props.height - pad}`
  return {line, area, last: points[points.length - 1]!}
})
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`"
       preserveAspectRatio="xMidYMid meet"
       :class="active ? tone : 'text-skin-base/30'" class="overflow-visible shrink-0">
    <polygon v-if="fill" :points="geometry.area" fill="currentColor" opacity="0.12"/>
    <polyline :points="geometry.line" fill="none" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    <circle :cx="geometry.last.x" :cy="geometry.last.y" r="2" fill="currentColor"/>
  </svg>
</template>
