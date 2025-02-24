<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Income: {{ initialValues.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label="Income Name">
            <n-input v-model:value="modelRef.name" placeholder="Enter income name"/>
          </n-form-item>

          <n-form-item path="grossIncome" label="Gross Income">
            <n-input-number v-model:value="modelRef.grossIncome" placeholder="Enter gross income amount"/>
          </n-form-item>

          <n-form-item path="growthRate" label="Growth Rate (%)">
            <n-space vertical class="w-full">
              <n-input-number class="w-full" v-model:value="modelRef.growthRate"/>
            </n-space>
          </n-form-item>
        </section>

        <n-form-item path="frequency" label="Frequency">
          <n-radio-group v-model:value="modelRef.frequency">
            <n-radio-button v-for="option in [
              { label: 'Weekly', value: 'weekly' },
              { label: 'Biweekly', value: 'biweekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annual', value: 'annual' }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <section class="grid grid-cols-4 gap-3">
          <n-form-item path="incomeType" label="Income Type">
            <n-radio-group v-model:value="modelRef.incomeType">
              <n-radio-button v-for="option in [
                { label: 'Ordinary', value: 'ordinary' }
              ]" :key="option.value" :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>
        </section>
      </n-form>
      <Bar v-if="data" id="my-chart-id"
           :options="chartOptions"
           :data="chartData"
      ></Bar>
    </template>
    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate"
                         @cancel="handleCancel"/>
    </template>

  </n-card>
</template>

<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import type {Income} from "~/types/Income";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {getAnnualAmount} from "~/utils";
import {useIncomeValidation} from "~/composables/validators/useIncomeValidator";
import {Frequency} from "~/types/Frequency";

interface Props {
  initialValues: Partial<Income>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);
const { formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel } =
    useCrudFormWithValidation(props.initialValues, emit, useIncomeValidation);

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
    data: generateGrowthData(getAnnualAmount(modelRef.value.grossIncome ?? 0, modelRef.value.frequency as Frequency), modelRef.value.growthRate),
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
</script>