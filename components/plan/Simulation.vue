<template>

  <PlanChartGrowth :states="planStates"></PlanChartGrowth>
  <CommandSequence
      :commandSequence="commandSequence"
      @update="handleUpdateCommandSequence"
  ></CommandSequence>
  <n-button @click="handleClickShowMeTheDataButton">
    <template #icon>
      <base-ico name="table" />
    </template>
    Show Me the Data
  </n-button>
  <n-modal v-model:show="showDataTable">
    <n-card class="max-w-[1800px]">
      <template #header>Simulation Data</template>
    <PlanTable v-if="plan && planStates" :planStates="planStates"/>
    </n-card>
  </n-modal>

</template>
<script setup lang="ts">
import type {Plan} from "~/types/Plan";
import type {CommandSequence} from "~/types/CommandSequence";
import PlanManager from "~/models/plan/PlanManager";
import type {PlanState} from "~/types/PlanState";

interface Props {
  plan: Plan
  commandSequence: CommandSequence
}

const props = defineProps<Props>()

let planManager: PlanManager | null = null
const planStates = ref<PlanState[]>([])
const finalPlanState = ref<PlanState | null>(null)

const emit = defineEmits(['update-command-sequence'])

function handleUpdateCommandSequence(commandSequence: CommandSequence) {
  emit("update-command-sequence", commandSequence)
}

watch(() => props.plan, (newValue, oldValue) => {
  console.log('what')
  planManager = new PlanManager(props.plan);
  planStates.value = planManager.simulate();
  finalPlanState.value = planStates.value[planStates.value.length - 1];
}, {
  deep: true,
  immediate: true,
})

const showDataTable = ref<boolean>(false)

function handleClickShowMeTheDataButton() {
  showDataTable.value = true
}
</script>