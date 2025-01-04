<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
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
          <n-form-item path="interestRate" v-bind="interestRateProps" :label="debtForm.interestRate.label">
            <n-input-number class="w-full" v-model:value="interestRate" size="small"/>
          </n-form-item>
        </section>
        <n-form-item path="paymentStrategy" v-bind="paymentStrategyProps" :label="debtForm.paymentStrategy.label">
          <section class="grid grid-cols-4 gap-3">
            <DebtProjectionCard :projection="projections.fixed" title="Fixed Payment" v-model="paymentStrategy" :value="DebtPaymentStrategy.Fixed">
              <template #inputs>
                <n-form-item path="paymentFixedAmount" v-bind="paymentFixedAmountProps"
                             :label="debtForm.paymentFixedAmount.label">
                  <n-input-number class="w-full" v-model:value="paymentFixedAmount" :step="100" :precision="2">
                    <template #prefix>$</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>
            <DebtProjectionCard :projection="projections.percentage_of_debt" title="Percentage of Debt" v-model="paymentStrategy" :value="DebtPaymentStrategy.PercentageOfDebt">
              <template #inputs>
                <n-form-item path="paymentPercentage" v-bind="paymentPercentageProps"
                             :label="debtForm.paymentPercentage.label">
                  <n-input-number class="w-full" v-model:value="paymentPercentage" :precision="2">
                    <template #suffix>%</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>
            <DebtProjectionCard :projection="projections.minimum_payment" title="Minimum Payment" v-model="paymentStrategy" :value="DebtPaymentStrategy.MinimumPayment">
              <template #inputs>
                <n-form-item path="paymentMinimum" v-bind="paymentMinimumProps" :label="debtForm.paymentMinimum.label">
                  <n-input-number class="w-full" v-model:value="paymentMinimum" :precision="2">
                    <template #prefix>$</template>
                    <template #suffix>per month</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>
            <DebtProjectionCard :projection="projections.maximum_payment" title="Maximum Payment" v-model="paymentStrategy" :value="DebtPaymentStrategy.Maximum"/>
          </section>
        </n-form-item>
        <Line v-if="data" id="my-chart-id" class="h-32"
              :options="chartOptions"
              :data="chartData"
        ></Line>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons v-if="mode !== 'view'" :mode="mode" :errors="errors" @update="handleUpdate" @create="handleCreate"
                         @cancel="handleCancel"/>
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
  debtPartial: Partial<Debt> | Debt;
  mode: 'create' | 'edit' | 'view'
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
        color: "#FFFFFF",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#FFFFFF",
      bodyColor: "#FFFFFF",
    },
  },
};

type DebtProjection = {
  data: number[]
  totalPaymentsMade: number
  totalInterestAccrued: number
  isPaid: boolean
  remainingDebt: number
}


function generateDebtProjection(debtConfig: Debt, maxIterations: number = 20): DebtProjection {
  if (debtConfig.principal === undefined) {
    return {}
  }
  let totalPaymentsMade = 0
  let totalInterestAccrued = 0
  let i = 0
  const data: number[] = [debtConfig.principal]
  while (i < maxIterations && data[i] > 0) {
    const payment = calculateDebtPayment(debtConfig, data[i]);
    const interest = (data[i] - payment) * (debtConfig.interestRate / 100)
    const principal = data[i] - payment + interest
    totalPaymentsMade += payment
    totalInterestAccrued += interest
    data.push(principal)
    i++
  }
  const remainingDebt = data[data.length - 1]
  const isPaid = remainingDebt === 0
  return {
    data: data,
    totalPaymentsMade: totalPaymentsMade,
    totalInterestAccrued: totalInterestAccrued,
    isPaid: isPaid,
    remainingDebt: remainingDebt
  }
}


const projections = computed<Record<DebtPaymentStrategy, DebtProjection>>(() => {
  console.log('wtf')
  const debtPartial: Partial<Omit<Debt, 'paymentStrategy'>> = {
    interestRate: interestRate.value,
    principal: principal.value,
    name: name.value,
    paymentFixedAmount: paymentFixedAmount.value,
    paymentMinimum: paymentMinimum.value,
    paymentPercentage: paymentPercentage.value,
  };

  const result = {} as Record<DebtPaymentStrategy, DebtProjection>;

  for (const paymentStrategy of Object.values(DebtPaymentStrategy)) {
    const debtConfig: Debt = {
      ...debtPartial,
      paymentStrategy: paymentStrategy as DebtPaymentStrategy,
    } as Debt;

    result[paymentStrategy as DebtPaymentStrategy] = generateDebtProjection(debtConfig, 30);
  }
  return result;
});


const chartData = computed(() => {

  return ({
    labels: Array.from({length: 30}, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: 'Fixed Payment',
        backgroundColor: "rgba(33, 150, 243, 0.5)",
        borderColor: "#2196F3",
        data: projections.value.fixed.data,
      },
      {
        label: 'Percentage of Debt',
        backgroundColor: "rgba(76, 175, 80, 0.5)",
        borderColor: "#4CAF50",
        data: projections.value.percentage_of_debt.data,
      },
      {
        label: 'Minimum Payment',
        backgroundColor: "rgba(255, 193, 7, 0.5)",
        borderColor: "#FFC107",
        data: projections.value.minimum_payment.data,
      },
      {
        label: 'Maximum Payment',
        backgroundColor: "rgba(244, 67, 54, 0.5)",
        borderColor: "#F44336",
        data: projections.value.maximum_payment.data,
      },
    ]
  });
});


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