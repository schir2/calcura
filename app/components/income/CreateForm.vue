<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import type { Income, IncomeInsert } from "#shared/types/Income"
import { incomeRules } from "~/utils/validators/incomeRules"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { getAnnualAmount } from "~/utils"
import type { Frequency } from "#shared/types/Frequency"
import { FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS } from "~/constants/FormConstants"
import { incomeDefaults } from "~/constants/IncomeConstants"

type Props = { initialValues?: Partial<Income> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: IncomeInsert]
  cancel: []
}>()

const model = ref<Partial<Income>>({ ...incomeDefaults, ...props.initialValues })
const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
const errorMessage = ref('')
rules.value = incomeRules(model).rules

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = ref(Array<number>(20).fill(0))

const chartOptions = {
  responsive: true,
}

const chartData = computed(() => ({
  labels: Array.from({ length: 20 }, (_, i) => `Year ${i + 1}`),
  datasets: [{
    label: 'Projection',
    backgroundColor: "#1355FF",
    data: generateGrowthData(getAnnualAmount(model.value.gross_income ?? 0, model.value.frequency as Frequency), model.value.growth_rate),
  }]
}))

function generateGrowthData(principal: number, growthRate: number = 0) {
  const growthData = Array(20).fill(0)
  const growthMultiplier = 1 + growthRate / 100
  growthData[0] = principal
  for (let i = 1; i < 19; i++) {
    growthData[i] = growthData[i - 1] * growthMultiplier
  }
  return growthData
}

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...insert } = model.value as Income
    emit('create', insert as IncomeInsert)
  })
}
</script>
<template>
  <n-card role="dialog" :class="FORM_MODAL_WIDTH_CLASS" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Income: {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >
        <n-form-item path="name" label="Income Name">
          <n-input v-model:value="model.name" placeholder="Enter income name"/>
        </n-form-item>

        <n-form-item path="gross_income" label="Gross Income">
          <n-input-number
              v-model:value="model.gross_income"
              placeholder="Enter gross income amount"
              class="w-full"
          />
        </n-form-item>

        <n-form-item path="growth_rate" label="Growth Rate (%)">
          <n-space vertical class="w-full">
            <n-input-number class="w-full" v-model:value="model.growth_rate"/>
          </n-space>
        </n-form-item>

        <n-form-item path="frequency" label="Frequency">
          <n-radio-group v-model:value="model.frequency">
            <n-radio-button v-for="option in [
              { label: 'Weekly', value: 'weekly' },
              { label: 'Biweekly', value: 'biweekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annual', value: 'annual' }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <Bar v-if="data" id="income-create-chart"
           :options="chartOptions"
           :data="chartData"
      ></Bar>
    </template>
    <template #footer>
      <base-stat class="text-end">
        <span class="text-skin-success">+${{
            $humanize.intComma(getAnnualAmount(model.gross_income ?? 0, model.frequency ?? 'annual'))
          }}/year</span>
      </base-stat>
    </template>
    <template #action>
      <FormActionButtons variant="create" @create="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>