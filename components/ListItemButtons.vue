<template>
  <n-button-group :size="size">
    <n-button tertiary round type="warning" @click="$emit('edit')">
      <template #icon>
        <Icon name="mdi:edit"/>
      </template>
    </n-button>
    <n-button tertiary round type="error" @click="$emit('remove')">
      <template #icon>
        <Icon name="mdi:remove"/>
      </template>
    </n-button>
    <n-button secondary round type="error" @click="$emit('delete')">
      <template #icon>
        <Icon name="mdi:delete"/>
      </template>
    </n-button>
  </n-button-group>
</template>
<script setup lang="ts">
interface Props {
  size: "tiny" | "small" | "medium" | "large"
}
const props = defineProps<Props>()
</script>