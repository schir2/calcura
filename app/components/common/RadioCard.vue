<template>
  <n-card
      :class="selected ? 'border-skin-success bg-skin-surface-hover transition-colors' : ''">
    <template #header>
      <label class="flex justify-between cursor-pointer text-skin-primary items-center">
        <span>{{ title }}</span>
        <n-radio :checked="selected" :value="value" @change="model = value"/>
      </label>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </n-card>
</template>
<script lang="ts" setup>

type Props = {
  title: string
  value: string | number | boolean

}

const model = defineModel()
const props = defineProps<Props>()

const selected = computed(() => {
  return props.value === model.value
})
</script>