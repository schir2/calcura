<template>
  <n-card title="Roth IRA (s)">
      <RothIraListItem v-for="(rothIra, index) in rothIras" :rothIra="rothIra" :key="rothIra.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></RothIraListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {RothIra, RothIraInsert, RothIraUpdate} from "~/types/RothIra";

type Props = {
  rothIras: RothIra[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: RothIraInsert]
  update: [id: number, update: RothIraUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: RothIraInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: RothIraUpdate) {
  emit('update', id, update)
}

</script>