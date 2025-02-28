<template>
  <n-card title="IRA (s)">
      <IraListItem v-for="(ira, index) in iras" :ira="ira" :key="ira.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></IraListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {Ira, IraTemplate} from "~/types/Ira";

interface Props {
  iras: Ira[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(ira: Ira) {
  emit('delete', ira);
}

function handleCreate(iraTemplate: IraTemplate) {
  emit('create', iraTemplate);
}

function handleUpdate(ira: Ira) {
  emit('update', ira);
}

function handleRemove(ira: Ira) {
  emit('remove', ira)
}

</script>