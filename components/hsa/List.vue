<template>
  <n-card title="Cash Reserve(s)">
      <HsaListItem v-for="(Hsa, index) in Hsas" :Hsa="Hsa" :key="Hsa.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></HsaListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {Hsa, HsaTemplate} from "~/types/Hsa";

interface Props {
  Hsas: Hsa[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(Hsa: Hsa) {
  emit('delete', Hsa);
}

function handleCreate(HsaTemplate: HsaTemplate) {
  emit('create', HsaTemplate);
}

function handleUpdate(Hsa: Hsa) {
  emit('update', Hsa);
}

function handleRemove(Hsa: Hsa) {
  emit('remove', Hsa)
}

</script>