<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Gross Savings at Age {{ finalPlanState.age }}</p>
    </template>
    <Pie v-if="data" :data="data" :options="options"/>
  </n-card>
</template>

<script lang="ts" setup>
import {darkTheme} from "naive-ui";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Pie} from 'vue-chartjs'
import type {PlanState} from "~/models/plan/PlanState";

interface Props {
  states: PlanState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(() => props.states[props.states.length - 1])


ChartJS.register(ArcElement, Tooltip, Legend)

const data = computed(() => {
  if (finalPlanState.value === undefined) {
    return
  }
  return {
    labels: ['Tax Deferred', 'Brokerage', 'Tax Exempt', 'Taxed Capital'],
    datasets: [
      {
        backgroundColor: [
          darkTheme.common.infoColor,
          darkTheme.common.warningColor,
          darkTheme.common.errorColor,
          darkTheme.common.successColor,
        ],
        data: [
          finalPlanState.value.savingsTaxDeferredEndOfYear ?? 0,
          finalPlanState.value.savingsTaxableEndOfYear ?? 0,
          finalPlanState.value.savingsTaxExemptEndOfYear ?? 0,
          finalPlanState.value.taxedCapital ?? 0,
        ]
      },
      {
        backgroundColor: [
          darkTheme.common.infoColor,
          darkTheme.common.warningColor,
          darkTheme.common.errorColor,
          darkTheme.common.successColor,
        ],
        data: [
          props.states[0].savingsTaxDeferredEndOfYear ?? 0,
          props.states[0].savingsTaxableEndOfYear ?? 0,
          props.states[0].savingsTaxExemptEndOfYear ?? 0,
          props.states[0].taxedCapital ?? 0,
        ]
      },
    ]
  }
})

const options = {
  responsive: true,
}

</script>