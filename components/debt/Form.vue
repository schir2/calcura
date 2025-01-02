<template>
  <n-card role="dialog" class="max-w-4xl" size="huge" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Debt: {{ debtPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" v-bind="nameProps" :label="debtForm.name.label">
            <n-input v-model:value="name"/>
          </n-form-item>
          <n-form-item path="principal" v-bind="principalProps" :label="debtForm.principal.label">
            <n-input-number class="w-full" v-model:value="principal"/>
          </n-form-item>
          <n-form-item path="paymentMinimum" v-bind="paymentMinimumProps" :label="debtForm.paymentMinimum.label">
            <n-input-number class="w-full" v-model:value="paymentMinimum"/>
          </n-form-item>
        </section>

        <n-form-item path="interestRate" v-bind="interestRateProps" :label="debtForm.interestRate.label">
          <n-space vertical class="w-full">
            <n-slider v-model:value="interestRate" :min="0" :max="50" :marks="{5: 'Medium', 15:'High', 30:'Extreme'}"/>
            <n-input-number v-model:value="interestRate" size="small"/>
          </n-space>
        </n-form-item>
        <n-form-item path="paymentStrategy" v-bind="paymentStrategyProps" :label="debtForm.paymentStrategy.label">
          <n-radio-group v-model:value="paymentStrategy">
            <n-radio-button v-for="option in debtForm.paymentStrategy.options" :key="option.value" :value="option.value"
                            :label="option.label"/>
          </n-radio-group>
        </n-form-item>
        <p class="grid grid-cols-2 gap-3">
          <n-form-item path="paymentFixedAmount" v-bind="paymentFixedAmountProps"
                       :label="debtForm.paymentFixedAmount.label">
            <n-input-number class="w-full" v-model:value="paymentFixedAmount"/>
          </n-form-item>
          <n-form-item path="paymentPercentage" v-bind="paymentPercentageProps"
                       :label="debtForm.paymentPercentage.label">
            <n-input-number class="w-full" v-model:value="paymentPercentage"/>
          </n-form-item>
        </p>
      </n-form>
      <Line v-if="data" id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
      ></Line>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" :errors="errors" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import {Line} from 'vue-chartjs'

import {debtForm, debtFormSchema} from "~/forms/debtForm";
import {useForm} from "vee-validate";
import {type Debt, DebtPaymentStrategy} from "~/models/debt/Debt";
import {naiveConfig} from "~/utils/schemaUtils";
import {calculateDebtPayment} from "~/models/debt/DebtManager";

interface Props {
  debtPartial: Partial<Debt>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: debtFormSchema,
  initialValues: props.debtPartial,
});

const [name, nameProps] = defineField('name', naiveConfig);
const [principal, principalProps] = defineField('principal', naiveConfig);
const [interestRate, interestRateProps] = defineField('interestRate', naiveConfig);
const [paymentMinimum, paymentMinimumProps] = defineField('paymentMinimum', naiveConfig);
const [paymentStrategy, paymentStrategyProps] = defineField('paymentStrategy', naiveConfig);
const [paymentFixedAmount, paymentFixedAmountProps] = defineField('paymentFixedAmount', naiveConfig);
const [paymentPercentage, paymentPercentageProps] = defineField('paymentPercentage', naiveConfig);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const data = ref(Array<number>(20).fill(0))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "#FFFFFF", // White text for legend labels
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for tooltips
      titleColor: "#FFFFFF", // White text for tooltip title
      bodyColor: "#FFFFFF", // White text for tooltip body
    },
  },
};

function generateGrowthData(debtConfig: Debt) {
  if (debtConfig.principal === undefined) {
    return []
  }
  let i = 0
  const data: number[] = [debtConfig.principal]
  while (i < 20 && data[i] > 0) {
    const payment = calculateDebtPayment(debtConfig, data[i]);
    data.push((data[i] - payment) * (1 + debtConfig.interestRate / 100))
    i++
  }
  return data
}

const chartData = computed(() => ({
  labels: Array.from({length: 20}, (_, i) => `Year ${i + 1}`),
  datasets: [
    {
      label: 'Fixed Payment',
      backgroundColor: "rgba(33, 150, 243, 0.5)",
      borderColor: "#2196F3",
      data: generateGrowthData({
        id: 1,
        interestRate: interestRate.value,
        principal: principal.value,
        name: name.value,
        paymentFixedAmount: paymentFixedAmount.value,
        paymentMinimum: paymentMinimum.value,
        paymentPercentage: paymentPercentage.value,
        paymentStrategy: DebtPaymentStrategy.Fixed
      }),
    },
    {
      label: 'Percentage of Debt',
      backgroundColor: "rgba(76, 175, 80, 0.5)",
      borderColor: "#4CAF50",
      data: generateGrowthData({
        id: 1,
        interestRate: interestRate.value,
        principal: principal.value,
        name: name.value,
        paymentFixedAmount: paymentFixedAmount.value,
        paymentMinimum: paymentMinimum.value,
        paymentPercentage: paymentPercentage.value,
        paymentStrategy: DebtPaymentStrategy.PercentageOfDebt
      }),
    },
    {
      label: 'Minimum Payment',
      backgroundColor: "rgba(255, 193, 7, 0.5)",
      borderColor: "#FFC107",
      data: generateGrowthData({
        id: 1,
        interestRate: interestRate.value,
        principal: principal.value,
        name: name.value,
        paymentFixedAmount: paymentFixedAmount.value,
        paymentMinimum: paymentMinimum.value,
        paymentPercentage: paymentPercentage.value,
        paymentStrategy: DebtPaymentStrategy.MinimumPayment
      }),
    },
    {
      label: 'Maximum Payment',
      backgroundColor: "rgba(244, 67, 54, 0.5)",
      borderColor: "#F44336",
      data: generateGrowthData({
        id: 1,
        interestRate: interestRate.value,
        principal: principal.value,
        name: name.value,
        paymentFixedAmount: paymentFixedAmount.value,
        paymentMinimum: paymentMinimum.value,
        paymentPercentage: paymentPercentage.value,
        paymentStrategy: DebtPaymentStrategy.MaximumPayment
      }),
    },
  ]
}));


function handleCreate() {
  emit('create', values)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', values)
}
</script>