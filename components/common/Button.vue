<script setup lang="ts">
interface Props {
  disabled: boolean,
}

const {disabled = false} = defineProps<Props>()

</script>

<template>
  <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    <slot name="leftIcon"></slot>
    <slot></slot>
    <slot name="rightIcon"></slot>
  </button>


</template>

<style scoped>

</style>