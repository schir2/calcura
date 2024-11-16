<script setup lang="ts">
interface Props {
  helpText: string
}
const {helpText = undefined} = defineProps<Props>()
</script>
<template>
  <label class="text-xs block mt-1 italic" v-if="helpText">{{ helpText }}</label>
</template>
