<script setup lang="ts">
type Size = 'small' | 'medium' | 'large'
type LabelPosition = 'top' | 'left'

interface Props {
  labelPrefix?: string
  labelSuffix?: string
  label?: string,
  value?: string,
  labelPosition?: LabelPosition,
  size?: Size
}

const {labelPosition = 'top', size = 'medium'} = defineProps<Props>()

const statClass = computed(() => {
  const statClasses = []
  switch (labelPosition) {
    case 'left':
      statClasses.push('flex items-center justify-start gap-1')
      break
    case 'top':
      statClasses.push('flex flex-col justify-start gap-0.5')
      break
  }
  return statClasses.join(' ')
})

const labelClass = computed(() => {
  const labelClass = []
  switch (size) {
    case 'small':
      labelClass.push('text-xs')
      break
    case 'medium':
      labelClass.push('text-s')
      break
    case 'large':
      labelClass.push('text-md')
  }
  return labelClass.join(' ')
})

const valueClass = computed(() => {
  const valueClass = []
  switch (size) {
    case 'small':
      valueClass.push('text-xl')
      break
    case 'medium':
      valueClass.push('text-2xl')
      break
    case 'large':
      valueClass.push('text-3xl')
  }
  return valueClass.join(' ')
})
</script>

<template>
  <div class="stat px-2 py-1 border border-skin-base rounded-xl" :class="statClass">
    <span :class="labelClass" class="flex items-center gap-1" v-if="label">
    <slot name="label">
      <slot name="label-prefix">
        <span v-if="labelPrefix">{{ labelPrefix }}</span>
      </slot>
     <label>{{ label }}</label>
      <slot name="label-suffix">
        <span v-if="labelSuffix">{{ labelSuffix }}</span>
      </slot>
    </slot>
    </span>
    <span class="font-light" :class="valueClass">
    <slot name="default">
      <span v-if="value">{{ value }}</span>
    </slot>
    </span>
  </div>

</template>