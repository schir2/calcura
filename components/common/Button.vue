<template>
  <button type="button" class="text-white bg-skin-info hover:bg-skin-info/80 inline-flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-skin-info font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2">
    <Icon v-if="iconLeft" :name="iconLeft"></Icon>
    <slot></slot>
    <Icon v-if="iconRight" :name="iconRight"></Icon>
  </button>



</template>
<script setup lang="ts">

interface Props {
  disabled?: boolean,
  iconLeft?: string
  iconRight?: string
}

const props = defineProps<Props>()

</script>