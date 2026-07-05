<!-- PROTOTYPE — shared lightweight SVG sparkline (the collapsed-density renderer). -->
<script setup lang="ts">
type Props = {
  series: number[]
  active?: boolean
  tone?: string
  width?: number
  height?: number
  fill?: boolean
  stretch?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  active: true, tone: 'text-skin-primary', width: 84, height: 26, fill: false, stretch: false,
})

const geometry = computed(() => {
  const series = props.series
  const count = series.length
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const pad = 2
  const points = series.map((value, index) => {
    const x = pad + (index / (count - 1)) * (props.width - 2 * pad)
    const y = props.height - pad - ((value - min) / span) * (props.height - 2 * pad)
    return {x, y}
  })
  const line = points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
  const area = `${pad},${props.height - pad} ${line} ${props.width - pad},${props.height - pad}`
  return {line, area, last: points[points.length - 1]!}
})
</script>

<template>
  <svg :width="stretch ? '100%' : width" :height="stretch ? '100%' : height"
       :viewBox="`0 0 ${width} ${height}`" :preserveAspectRatio="stretch ? 'none' : 'xMidYMid meet'"
       :class="active ? tone : 'text-skin-base/30'" class="overflow-visible">
    <polygon v-if="fill" :points="geometry.area" fill="currentColor" opacity="0.12"/>
    <polyline :points="geometry.line" fill="none" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    <circle :cx="geometry.last.x" :cy="geometry.last.y" r="2" fill="currentColor"/>
  </svg>
</template>