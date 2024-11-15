<script setup lang="ts">
interface Props {
  label: string
}
const {label = undefined} = defineProps<Props>()
</script>
<template>
  <label class="text-xs" v-if="label">{{ label }}</label>
</template>
