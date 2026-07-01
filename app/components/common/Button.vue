<template>
  <n-button type="info" round :disabled="disabled">
    <template v-if="iconLeft" #icon>
      <Icon :name="iconLeft"></Icon>
    </template>
    <slot></slot>
    <Icon v-if="iconRight" :name="iconRight"></Icon>
  </n-button>
</template>
<script setup lang="ts">

type Props = {
  disabled?: boolean,
  iconLeft?: string
  iconRight?: string
}

const props = defineProps<Props>()

</script>