<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Gross Savings at Age {{ finalPlanState.age }}</p>
    </template>
    <Pie v-if="data" :data="data" :options="options"/>
    <template #footer>
      <div class="flex items-center justify-evenly gap-2">
        <base-stat size="small" class="flex-1" label="Taxable"
                   :value="`$${$humanize.intcomma(finalPlanState.savingsTaxableEndOfYear)}`"></base-stat>
        <base-stat size="small" class="flex-1" label="Tax Deferred">${{ $humanize.intcomma(finalPlanState.savingsTaxDeferredEndOfYear) }}</base-stat>
        <base-stat size="small" class="flex-1" label="Tax Exempt">${{ $humanize.intcomma(finalPlanState.savingsTaxExemptEndOfYear) }}</base-stat>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>

const {naiveTheme: theme} = storeToRefs(useThemeStore())
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Pie} from 'vue-chartjs'
import type {PlanState} from "~/types/PlanState";

interface Props {
  states: PlanState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(() => props.states[props.states.length - 1])


ChartJS.register(ArcElement, Tooltip, Legend)

const data = computed(() => {
  if (!finalPlanState?.value) {
    return
  }
  return {
    labels: ['Tax Deferred', 'Brokerage', 'Tax Exempt', 'Taxed Capital'],
    datasets: [
      {
        backgroundColor: [
          theme.value.common.infoColor,
          theme.value.common.warningColor,
          theme.value.common.errorColor,
          theme.value.common.successColor,
        ],
        data: [
          finalPlanState.value.savingsTaxDeferredEndOfYear ?? 0,
          finalPlanState.value.savingsTaxableEndOfYear ?? 0,
          finalPlanState.value.savingsTaxExemptEndOfYear ?? 0,
          finalPlanState.value.taxedCapital ?? 0,
        ]
      },
    ]
  }
})

const options = {
  responsive: true,
}

</script>