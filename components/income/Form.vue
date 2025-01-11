<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Income: {{ incomePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <section class="grid grid-cols-3 gap-3">

          <n-form-item path="name" v-bind="nameProps" :label="incomeForm.name.label" required>
            <n-input v-model:value="name"/>
          </n-form-item>
          <n-form-item path="grossIncome" :label="incomeForm.grossIncome.label" v-bind="grossIncomeProps">
            <n-input-number v-model:value="grossIncome"/>
          </n-form-item>
          <n-form-item path="growthRate" :label="incomeForm.growthRate.label" v-bind="growthRateProps">
              <n-input-number v-model:value="growthRate">
                <template #prefix>
                  <n-tag size="small">%</n-tag>
                </template>
              </n-input-number>
          </n-form-item>
        </section>

        <n-form-item path="incomeType" :label="incomeForm.incomeType.label" v-bind="incomeTypeProps">
          <n-radio-group v-model:value="incomeType">
            <n-radio-button v-for="option in incomeForm.incomeType.options" :key="option.value" :label="option.label"
                            :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="frequency" :label="incomeForm.frequency.label" v-bind="frequencyProps">
          <n-radio-group v-model:value="frequency">
            <n-radio-button v-for="option in incomeForm.frequency.options" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <Bar v-if="data" id="my-chart-id"
           :options="chartOptions"
           :data="chartData"
      ></Bar>
    </template>
    <template #action>
      <FormActionButtons :mode="mode" :errors="errors" @update="handleUpdate" @create="handleCreate"
                         @cancel="handleCancel"/>
    </template>

  </n-card>
</template>

<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {incomeForm, incomeFormSchema} from "~/forms/incomeForm";
import {useForm} from "vee-validate";
import type {Income} from "~/models/income/Income";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {naiveConfig} from "~/utils/schemaUtils";
import {getAnnualAmount} from "~/utils";
import type {Frequency} from "~/models/expense/Expense";

interface Props {
  incomePartial: Partial<Income>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: incomeFormSchema,
  initialValues: props.incomePartial,
});

const [name, nameProps] = defineField('name', naiveConfig);
const [frequency, frequencyProps] = defineField('frequency', naiveConfig);
const [grossIncome, grossIncomeProps] = defineField('grossIncome', naiveConfig);
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig);
const [incomeType, incomeTypeProps] = defineField('incomeType', naiveConfig);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = ref(Array<number>(20).fill(0))

const chartOptions = {
  responsive: true,
};

const chartData = computed(() => ({
  labels: Array.from({length: 20}, (_, i) => `Year ${i + 1}`),
  datasets: [{
    label: 'Projection',

    backgroundColor: "#1355FF",
    data: generateGrowthData(getAnnualAmount(grossIncome.value ?? 0, frequency.value as Frequency), growthRate.value),
  }]
}));

function generateGrowthData(principal: number, growthRate: number = 0) {
  const data = Array(20).fill(0)
  const growthMultiplier = 1 + growthRate / 100
  data[0] = principal
  for (let i = 1; i < 19; i++) {
    data[i] = data[i - 1] * growthMultiplier
  }
  return data
}

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