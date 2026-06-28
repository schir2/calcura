<script lang="ts" setup>
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {PlanWithRelations} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";

type Props = {
  command_sequences: CommandSequenceWithRelations[]
  plan: PlanWithRelations
}
const props = defineProps<Props>()
const activeTab = defineModel<number | null>();

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
  remove: [payload: { modelName: ModelName, data: unknown }]
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
          :plan="plan"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
          @remove="$emit('remove', $event)"
      />
    </n-tab-pane>
  </n-tabs>
</template>