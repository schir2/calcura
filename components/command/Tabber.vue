<script lang="ts" setup>
import type {CommandSequence} from "~/types/CommandSequence";
import type {Plan} from "~/types/Plan";

interface Props {
  plan: Plan
}
const props = defineProps<Props>()

const activeTab = ref<number|null>(null);

async function handleAdd(){

}

async function handleClose(){

}

onMounted(async ()=>{
  if(props.plan?.commandSequences?.length > 0){
    activeTab.value = props.plan.commandSequences[0].id
    console.log(activeTab.value)
  }
})

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
      <template #tab>{{commandSequence.name}}</template>
      {{ commandSequence.name }}
      {{commandSequence }}
    </n-tab-pane>
  </n-tabs>
</template>