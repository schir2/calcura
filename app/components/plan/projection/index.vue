<template>
  <h2 class="text-3xl">Plan States</h2>
  <CommonList>
    <CommonListItem v-for="(planState, index) in planStates" :key="index"
                    class="grid grid-cols-4 gap-3"
    >
      <span>{{planState.plan.age}}</span>
      <span>{{planState.plan.year}}</span>
      <span>{{planState.income.taxable}}</span>
      <span>{{planState.income.gross}}</span>
    </CommonListItem>
  </CommonList>
</template>
<script lang="ts" setup>
import type {OrchestratorState} from "#shared/types/OrchestratorState";

type Props = {
  planStates: OrchestratorState[]
}

const props = defineProps<Props>()
</script>