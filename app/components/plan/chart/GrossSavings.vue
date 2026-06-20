<template>
  <n-card>
    <template #header>
      <p v-if="finalPlanState" class="text-xl text-center">Gross Savings at Age {{ finalPlanState.age }}</p>
    </template>
    <Pie v-if="data" :data="data" :options="options"/>
    <template #footer>
      <div class="flex items-center justify-evenly gap-2 flex-wrap">
        <base-stat size="small" class="flex-1" label="Taxable"
                   :value="`$${$humanize.intcomma(finalPlanState.savings_taxable_end_of_year)}`"></base-stat>
        <base-stat size="small" class="flex-1" label="Tax Deferred">${{
            $humanize.intcomma(finalPlanState.savings_tax_deferred_end_of_year)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Tax Exempt">${{
            $humanize.intcomma(finalPlanState.savings_tax_exempt_end_of_year)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Not Invested">${{
            $humanize.intcomma(finalPlanState.taxed_capital)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Cash Reserves">${{
            $humanize.intcomma(finalPlanState.cash_reserves_total)
          }}</base-stat>
        <base-stat size="small" class="flex-1" label="Gross Investments">${{
            $humanize.intcomma(finalPlanState.savings_end_of_year)
          }}</base-stat>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>

const {naiveTheme: theme} = storeToRefs(useThemeStore())
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Pie} from 'vue-chartjs'
import type {PlanState} from "#shared/types/PlanState";

type Props = {
  states: PlanState[]
}


const props = defineProps<Props>()
const finalPlanState = computed(():PlanState => props.states[props.states.length - 1])


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
          finalPlanState.value.savings_tax_deferred_end_of_year ?? 0,
          finalPlanState.value.savings_taxable_end_of_year ?? 0,
          finalPlanState.value.savings_tax_exempt_end_of_year ?? 0,
          finalPlanState.value.taxed_capital ?? 0,
        ]
      },
    ]
  }
})

const options = {
  responsive: true,
}

</script>