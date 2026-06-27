<script lang="ts" setup>
import type {CommandSequence} from "#shared/types/CommandSequence";
import type {ModelName} from "#shared/types/ModelName";

type Props = {
  command_sequences: CommandSequence[]
}
const props = defineProps<Props>()
const activeTab = defineModel<number>('activeTab');

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
  remove: [payload: { modelName: ModelName, data: unknown }]
  'update-sequence': [sequence: CommandSequence]
  'delete-sequence': [id: number]
  'create-sequence': []
}>()

function handleClickDeleteSequence(commandSequenceId: number) {
  emit('delete-sequence', commandSequenceId);
}

const addable = computed(() => {
  return props.command_sequences.length <= 5
})


const closeable = computed(() => {
  return props.command_sequences.length > 1
})

</script>
<template>
  <n-tabs
      v-model:value="activeTab"
      type="card"
      :addable="addable"
      :closable="closeable"
      tab-style="min-width: 80px;"
      @close="handleClickDeleteSequence"
      @add="$emit('create-sequence')"
  >
    <n-tab-pane v-for="commandSequence in command_sequences" :key="commandSequence.id" :name="commandSequence.id">
      <template #tab>{{ commandSequence.name }}</template>
      <CommandSequence
          :commandSequence="commandSequence"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
          @remove="$emit('remove', $event)"
          @update-sequence="$emit('update-sequence', $event)"
      />
    </n-tab-pane>
  </n-tabs>
</template>