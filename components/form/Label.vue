<script setup lang="ts">
interface Props {
  label: string
  forId?: string
}
const {label = undefined} = defineProps<Props>()
</script>
<template>
  <label class="text-s font-medium" :for="forId" v-if="label">{{ label }}</label>
</template>
