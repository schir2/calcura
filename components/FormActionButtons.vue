<template>
  <n-button-group>
    <n-button secondary round v-if="mode ==='edit'" type="success" @click="emit('update')">
      <template #icon>
        <Icon name="mdi:content-save"/>
      </template>
      <span>Save</span>
    </n-button>
    <n-button secondary round v-if="mode==='edit'" type="warning" @click="emit('create')">
      <template #icon>
        <Icon name="mdi:content-duplicate"/>
      </template>
      <span>Duplicate</span>
    </n-button>
    <n-button secondary round v-if="mode==='create'" type="success" @click="emit('create')">
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
interface Props {
  mode: 'edit' | 'create'
}

const props = defineProps<Props>()
const emit = defineEmits(['update', 'create', 'cancel'])
</script>