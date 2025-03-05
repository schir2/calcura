<script lang="ts" setup>
import type {Plan} from "~/types/Plan";

interface Props {
  plan: Plan
  activeTab: number | null;
}
const props = defineProps<Props>()
const activeTab = toRef(props.activeTab);

const emit = defineEmits(['update', 'delete', 'remove', 'update-sequence', 'delete-sequence', 'create-sequence'])

function handleClickDeleteSequence(commandSequenceId: number){
  emit('delete-sequence', commandSequenceId);
}

const addable = computed(()=>{
  return props.plan.commandSequences.length <= 5
})


const closeable = computed(()=>{
  return props.plan.commandSequences.length > 1
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
    <n-tab-pane v-for="commandSequence in plan.commandSequences" :key="commandSequence.id" :name="commandSequence.id">
      <template #tab>{{ commandSequence.name }}</template>
      <CommandSequence
          :plan="plan"
          :commandSequence="commandSequence"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
          @remove="$emit('remove', $event)"
          @update-sequence="$emit('update-sequence', $event)"
      />
    </n-tab-pane>
  </n-tabs>
</template>