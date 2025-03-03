<script lang="ts" setup>
import type {Plan} from "~/types/Plan";

interface Props {
  plan: Plan
  activeTab: number | null;
}
const props = defineProps<Props>()
const activeTab = toRef(props.activeTab);

const emit = defineEmits(['update', 'delete', 'remove', 'update-sequence'])

async function handleAdd() {

}
async function handleClose() {

}

</script>
<template>
  <n-tabs
      v-model:value="activeTab"
      type="card"
      :addable="true"
      :closable="true"
      tab-style="min-width: 80px;"
      @close="handleClose"
      @add="handleAdd"
  >
    <n-tab-pane v-for="commandSequence in plan.commandSequences" :key="commandSequence.id" :name="commandSequence.id">
      <template #tab>{{ commandSequence.name }}</template>
      <CommandSequence
          :plan="plan"
          :commandSequence="commandSequence"
          @update="$emit('update',$event)"
          @delete="$emit('delete',$event)"
          @remove="$emit('remove', $event)"
          @update-sequence="$emit('update-sequence', $event)"
      />
    </n-tab-pane>
  </n-tabs>
</template>