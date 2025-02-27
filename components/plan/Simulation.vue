<template>

  <PlanChartGrowth :states="planStates"></PlanChartGrowth>
  <CommandSequence
      :commandSequence="commandSequence"
      @update="handleUpdateCommandSequence"
  ></CommandSequence>
  <PlanTable v-if="plan && planStates" :planStates="planStates"/>

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

watch(props.plan, () => {
  planManager = new PlanManager(props.plan);
  planStates.value = planManager.simulate();
  finalPlanState.value = planStates.value[planStates.value.length - 1];
})

</script>