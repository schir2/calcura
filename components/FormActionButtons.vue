<template>
  {{errors}}
  <n-button-group v-if="mode !== 'view'">
    <n-button secondary round v-if="mode ==='edit'" type="success" :disabled="hasErrors" @click="emit('update')">
      <template #icon>
        <Icon name="mdi:content-save"/>
      </template>
      <span>Save</span>
    </n-button>
    <n-button secondary round v-if="mode==='edit'" type="warning" :disabled="hasErrors" @click="emit('create')">
      <template #icon>
        <Icon name="mdi:content-duplicate"/>
      </template>
      <span>Duplicate</span>
    </n-button>
    <n-button secondary round v-if="mode==='create'" type="success" :disabled="hasErrors" @click="emit('create')">
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
<script lang="ts" setup>

import type {FormValidationError} from 'naive-ui'

interface Props {
  mode: 'edit' | 'create' | 'view'
  errors?: FormValidationError[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update', 'create', 'cancel'])
const hasErrors = computed(()=> props.errors && Object.keys(props.errors).length > 0)
</script>