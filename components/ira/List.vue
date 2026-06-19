<template>
  <n-card title="IRA (s)">
      <IraListItem v-for="(ira, index) in iras" :ira="ira" :key="ira.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></IraListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {Ira, IraInsert, IraUpdate} from "~/types/Ira";

type Props = {
  iras: Ira[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: IraInsert]
  update: [id: number, update: IraUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: IraInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: IraUpdate) {
  emit('update', id, update)
}

</script>