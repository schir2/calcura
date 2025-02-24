<template>

  <PlanChartGrowth :states="planStates"></PlanChartGrowth>
  <CommandSequence :commandSequence="commandSequence"></CommandSequence>
  <PlanTable v-if="plan && planStates" :planStates="planStates"/>

</template>
<script setup lang="ts">
import type {Plan} from "~/types/Plan";
import type {CommandSequence} from "~/types/CommandSequence";
import PlanManager from "~/models/plan/PlanManager";
import type {Command} from "~/types/Command";
import {compareAndSyncCommands} from "~/utils/commandUtils";
import type {PlanState} from "~/types/PlanState";

interface Props {
  plan: Plan
  commandSequence: CommandSequence
}

const props = defineProps<Props>()

let planManager: PlanManager | null = null
const orderedCommands = ref<Command[] | null>(null)
const planStates = ref<PlanState[]>([])
const finalPlanState = ref<PlanState | null>(null)

async function handleCommandSequenceUpdate(commands: Command[]) {
  orderedCommands.value = commands
  planManager = new PlanManager(props.plan);
  planStates.value = planManager.simulate(orderedCommands.value)
}

const planRef = toRef(props.plan)

watch(planRef, () => {

  planManager = new PlanManager(props.plan);
  const newCommands: Command[] = planManager.getCommands()
  if (!orderedCommands.value) {
    orderedCommands.value = newCommands

  } else {
    orderedCommands.value = compareAndSyncCommands(orderedCommands.value, newCommands)
  }
  planStates.value = planManager.simulate();
  finalPlanState.value = planStates.value[planStates.value.length - 1];
})

</script>