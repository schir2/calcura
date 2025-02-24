<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Tax Deferred Savings at Age {{ finalPlanState.age }}</p>
    </template>
    <Line v-if="data" :data="data" :options="options"/>
  </n-card>
</template>

<script lang="ts" setup>
import {darkTheme} from "naive-ui";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import {Line} from 'vue-chartjs'
import type {PlanState} from "~/types/PlanState";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface Props {
  states: PlanState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(() => props.states[props.states.length - 1])
const series = computed(() => props.states.map(state => (state.savingsTaxDeferredEndOfYear)))


ChartJS.register(ArcElement, Tooltip, Legend)

const data = computed(() => {
  if (series.value === undefined) {
    return
  }
  return {

    labels: Array.from({length: series.value.length}, (_, i) => `Age ${props.states[i].age}`),
    datasets: [
      {
        borderColor: darkTheme.common.infoColorHover,
        backgroundColor: darkTheme.common.infoColor,
        data: series.value
      },
    ]
  }
})

const options = {
  responsive: true,
}

</script>