<template>
  <n-card
      :style="selectedStyles">
    <template #header>
      <label class="flex justify-between cursor-pointer text-skin-primary items-center">
        <span>{{ title }}</span>
        <input type="radio" v-model="model" :value="value"></input>
      </label>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import {darkTheme} from 'naive-ui'

interface Props {
  title: string
  value: string | number | boolean

}

const model = defineModel()
const props = defineProps<Props>()

const selected = computed(() => {
  return props.value === model.value
})

const selectedStyles = computed(() => {
  if (!selected.value) return {}
  return {
    border: `1px solid ${darkTheme.common.successColor}`,
    backgroundColor: darkTheme.common.hoverColor,
    transition: 'background-color 0.3s, border-color 0.3s'
  }
})
</script>