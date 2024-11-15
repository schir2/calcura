<script setup lang="ts">
interface Props {
  helpText: string
}
const {helpText = undefined} = defineProps<Props>()
</script>
<template>
  <label class="text-xs" v-if="helpText">{{ helpText }}</label>
</template>
