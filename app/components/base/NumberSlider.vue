<script setup lang="ts">
type Props = {
  min?: number
  max?: number
  step?: number
}
const {min = 0, max = 100, step = 1} = defineProps<Props>()

const value = defineModel<number | null>({default: null})

const sliderValue = computed<number>(() => {
  const current = value.value ?? min
  return Math.min(Math.max(current, min), max)
})

function onSlider(next: number) {
  value.value = next
}
</script>

<template>
  <div class="flex items-center gap-3 w-full">
    <n-slider
        class="flex-1 min-w-0"
        :value="sliderValue"
        :min="min"
        :max="max"
        :step="step"
        @update:value="onSlider"
    />
    <n-input-number
        v-model:value="value"
        class="w-32 shrink-0"
        :step="step"
    />
  </div>
</template>