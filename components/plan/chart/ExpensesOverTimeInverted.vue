<template>
  <n-card>
<!--    <template #header>-->
<!--      <p v-if="finalPlanState" class="text-xl text-center">Expenses Over Time</p>-->
<!--    </template>-->
    <Bar v-if="data" :data="data" :options="options"/>
    <div class="flex items-center justify-between">

      <n-statistic label="Total">${{ $humanize.intcomma(finalState.expensesTotalLifetime) }}</n-statistic>
      <n-statistic label="Paid">${{ $humanize.intcomma(finalState.expensesPaidLifetime) }}</n-statistic>
      <n-statistic label="Shortfall">
        <template #prefix>
          <base-ico v-if="finalState.expensesShortfallLifetime === 0" class="text-skin-success" name="success"/>
          <base-ico v-else class="text-skin-warning" name="warning"/>
        </template>
        ${{ $humanize.intcomma(finalState.expensesShortfallLifetime) }}</n-statistic>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {darkTheme} from "naive-ui";
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'

import type {PlanState} from "~/types/PlanState";

interface Props {
  states: PlanState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(() => props.states[props.states.length - 1])
const expensesPaid = computed(() => props.states.map(state => (state.expensesPaid)))
const expensesTotal = computed(() => props.states.map(state => (state.expensesTotal)))
const expensesShortfall = computed(() => props.states.map(state => (state.expensesShortfall)))
const finalState = computed(() => {
  return props.states[props.states.length - 1]
})


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = computed(() => {
  if (expensesPaid.value === undefined) {
    return
  }
  return {

    labels: Array.from({length: expensesPaid.value.length}, (_, i) => `Age ${props.states[i].age}`),
    datasets: [
      {
        label: 'Paid',
        borderColor: darkTheme.common.infoColorHover,
        backgroundColor: darkTheme.common.infoColor,
        data: expensesPaid.value
      },
      {
        label: 'ShortFall',
        borderColor: darkTheme.common.errorColorHover,
        backgroundColor: darkTheme.common.errorColor,
        data: expensesShortfall.value
      },
    ]
  }
})

const options = {
  responsive: true,
  scales: {
    y: {
      reverse: true,
      stacked: true,
    },
    x: {
      display: false,
      stacked: true,
    }
  },
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

</script>