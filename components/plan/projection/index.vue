<template>
  <h2 class="text-3xl">Plan States</h2>
  <CommonList>
    <CommonListItem v-for="(planState, index) in planStates" :key="index"
                    class="grid grid-cols-4 gap-3"
    >
      <span>{{planState.age}}</span>
      <span>{{planState.year}}</span>
      <span>{{planState.taxableIncome}}</span>
      <span>{{planState.grossIncome}}</span>
    </CommonListItem>
  </CommonList>
</template>
<script lang="ts" setup>
import type PlanState from "~/models/plan/PlanState";

interface Props {
  planStates: PlanState[]
}

const props = defineProps<Props>()
</script>