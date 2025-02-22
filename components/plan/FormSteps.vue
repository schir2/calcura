<template>
  <n-steps v-model:current="currentStep" >
    <n-step title="Profile">
      <template #icon>
        <Icon name="mdi:user"/>
      </template>
    </n-step>
    <n-step title="Rates">
      <template #icon>
        <Icon name="mdi:user"/>
      </template>
    </n-step>
    <n-step title="When to Retire?">
      <template #icon>
        <Icon name="mdi:user"/>
      </template>
    </n-step>
  </n-steps>
</template>
<script lang="ts" setup>
const currentStep = defineModel<number>(1);
const emit = defineEmits(['update'])
watch(currentStep, (value, oldValue) => {
  emit('update', {value: value, oldValue: oldValue});
})
</script>