<script lang="ts" setup>
import {darkTheme} from 'naive-ui'
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import {Line} from 'vue-chartjs'
import type {DebtProjection} from "~/components/debt/Form.vue";
import {DebtPaymentStrategy} from "~/models/debt/Debt";

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
  projections: Record<DebtPaymentStrategy, DebtProjection>
}
const props = defineProps<Props>()

const chartData = computed(() => {

  return ({
    labels: Array.from({length: 30}, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: 'Fixed Payment',
        backgroundColor: darkTheme.common.infoColor,
        borderColor: darkTheme.common.infoColorHover,
        data: props.projections.fixed.data,
      },
      {
        label: 'Percentage of Debt',
        backgroundColor: darkTheme.common.successColor,
        borderColor: darkTheme.common.successColor,
        data: props.projections.percentage_of_debt.data,
      },
      {
        label: 'Minimum Payment',
        backgroundColor: darkTheme.common.warningColor,
        borderColor: darkTheme.common.warningColor,
        data: props.projections.minimum_payment.data,
      },
      {
        label: 'Maximum Payment',
        backgroundColor: darkTheme.common.errorColor,
        borderColor: darkTheme.common.errorColor,
        data: props.projections.maximum_payment.data,
      },
    ]
  });
});
const data = ref(Array<number>(20).fill(0))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: darkTheme.common.textColorBase,
      },
    },
    tooltip: {
      backgroundColor: darkTheme.common.bodyColor,
      titleColor: darkTheme.common.textColorBase,
      bodyColor: darkTheme.common.bodyColor,
    },
  },
};

</script>
<template>
  <Line v-if="data" id="my-chart-id" class="h-32"
        :options="chartOptions"
        :data="chartData"
  ></Line>
</template>