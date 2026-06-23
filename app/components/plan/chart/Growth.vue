<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Tax Exempt Savings at Age {{ finalPlanState.plan.age }}</p>
    </template>
    <Bar v-if="data" :data="data" :options="options"/>
  </n-card>
</template>

<script lang="ts" setup>
import {darkTheme} from "naive-ui";
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'

import type {OrchestratorState} from "#shared/types/OrchestratorState";

type Props = {
  states: OrchestratorState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(() => props.states[props.states.length - 1])
const taxDeferredSeries = computed(() => props.states.map(state => state.assets.tax_deferred.balance_end))
const taxExemptSeries = computed(() => props.states.map(state => state.assets.tax_exempt.balance_end))
const taxableSeries = computed(() => props.states.map(state => state.assets.taxable.balance_end))
const taxedCapitalSeries = computed(() => props.states.map(state => state.cash.net))


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = computed(() => {
  if (taxDeferredSeries.value === undefined) {
    return
  }
  return {

    labels: Array.from({length: taxDeferredSeries.value.length}, (_, i) => `Age ${props.states[i].plan.age}`),
    datasets: [
      {
        label: 'Tax Deferred',
        borderColor: darkTheme.common.infoColorHover,
        backgroundColor: darkTheme.common.infoColor,
        data: taxDeferredSeries.value
      },
      {
        borderColor: darkTheme.common.successColorHover,
        backgroundColor: darkTheme.common.successColor,
        label: 'Tax Exempt',
        data: taxExemptSeries.value
      },
      {
        label: 'Taxed Capital',
        borderColor: darkTheme.common.errorColorHover,
        backgroundColor: darkTheme.common.errorColor,
        data: taxedCapitalSeries.value
      },
      {
        label: 'Taxable',

        borderColor: darkTheme.common.warningColorHover,
        backgroundColor: darkTheme.common.warningColor,
        data: taxableSeries.value
      },
    ]
  }
})

const options = {
  responsive: true,
  scales: {
    y: {
      stacked: true,
    },
    x: {
      stacked: true,
    }
  }
}

</script>