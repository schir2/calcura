<template>
  <n-card title="Roth IRA (s)">
      <RothIraListItem v-for="(rothIra, index) in rothIras" :rothIra="rothIra" :key="rothIra.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></RothIraListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {RothIra, RothIraTemplate} from "~/types/RothIra";

interface Props {
  rothIras: RothIra[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(rothIra: RothIra) {
  emit('delete', rothIra);
}

function handleCreate(rothIraTemplate: RothIraTemplate) {
  emit('create', rothIraTemplate);
}

function handleUpdate(rothIra: RothIra) {
  emit('update', rothIra);
}

function handleRemove(rothIra: RothIra) {
  emit('remove', rothIra)
}

</script>