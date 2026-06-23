<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Gross Savings at Age {{ finalPlanState.plan.age }}</p>
    </template>
    <Pie v-if="data" :data="data" :options="options"/>
    <template #footer>
      <div class="flex items-center justify-evenly gap-2 flex-wrap">
        <base-stat size="small" class="flex-1" label="Taxable"
                   :value="`$${$humanize.intcomma(finalPlanState.assets.taxable.balance_end)}`"></base-stat>
        <base-stat size="small" class="flex-1" label="Tax Deferred">${{
            $humanize.intcomma(finalPlanState.assets.tax_deferred.balance_end)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Tax Exempt">${{
            $humanize.intcomma(finalPlanState.assets.tax_exempt.balance_end)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Not Invested">${{
            $humanize.intcomma(finalPlanState.cash.net)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Cash Reserves">${{
            $humanize.intcomma(finalPlanState.assets.cash_reserve.balance_end)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Gross Investments">${{
            $humanize.intcomma(grossSavingsEndOfYear)
          }}</base-stat>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>

const {naiveTheme: theme} = storeToRefs(useThemeStore())
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Pie} from 'vue-chartjs'
import type {OrchestratorState} from "#shared/types/OrchestratorState";

type Props = {
  states: OrchestratorState[]
}


const props = defineProps<Props>()
const finalPlanState = computed((): OrchestratorState => props.states[props.states.length - 1])

const grossSavingsEndOfYear = computed(() => {
  const state = finalPlanState.value
  return state.assets.tax_deferred.balance_end
      + state.assets.tax_exempt.balance_end
      + state.assets.taxable.balance_end
      + state.cash.net
})

ChartJS.register(ArcElement, Tooltip, Legend)

const data = computed(() => {
  if (!finalPlanState?.value) {
    return
  }
  return {
    labels: ['Tax Deferred', 'Brokerage', 'Tax Exempt', 'Not Invested'],
    datasets: [
      {
        backgroundColor: [
          theme.value.common.warningColor,
          theme.value.common.infoColor,
          theme.value.common.successColor,
          theme.value.common.errorColor,
        ],
        data: [
          finalPlanState.value.assets.tax_deferred.balance_end ?? 0,
          finalPlanState.value.assets.taxable.balance_end ?? 0,
          finalPlanState.value.assets.tax_exempt.balance_end ?? 0,
          finalPlanState.value.cash.net ?? 0,
        ]
      },
    ]
  }
})

const options = {
  responsive: true,
}

</script>