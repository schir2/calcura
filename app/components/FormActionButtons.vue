<script lang="ts" setup>
type Props = {
  variant: 'create' | 'update'
}
const props = defineProps<Props>()
const emit = defineEmits<{
  update: []
  create: []
  cancel: []
}>()
</script>
<template>
  <n-button-group>
    <n-button secondary round v-if="variant === 'update'" type="success" @click="emit('update')">
      <template #icon>
        <Icon name="mdi:content-save"/>
      </template>
      <span>Save</span>
    </n-button>
    <n-button secondary round v-if="variant === 'create'" type="success" @click="emit('create')">
      <template #icon>
        <Icon name="mdi:content-save"/>
      </template>
      <span>Create</span>
    </n-button>
    <n-button secondary round type="error" @click="emit('cancel')">
      <template #icon>
        <Icon name="mdi:close"/>
      </template>
      Cancel
    </n-button>
  </n-button-group>
</template>