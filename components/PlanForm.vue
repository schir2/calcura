<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Plan {{ planPartial.id }}: {{ planPartial.name }}</h3>
    </template>
    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="nameProps">
          <n-input v-model:value="name"></n-input>
        </n-form-item>

        <n-form-item path="age" label="Age" v-bind="ageProps">
          <n-input-number v-model:value="age" />
        </n-form-item>

        <n-form-item path="year" label="Year" v-bind="yearProps">
          <n-input-number v-model:value="year" />
        </n-form-item>

        <n-form-item path="lifeExpectancy" label="Life Expectancy" v-bind="lifeExpectancyProps">
          <n-input-number v-model:value="lifeExpectancy" />
        </n-form-item>

        <n-divider />

        <n-form-item path="taxStrategy" label="Tax Strategy" v-bind="taxStrategyProps">
          <n-radio-group v-model:value="taxStrategy">
            <n-radio-button v-for="item in planForm.taxStrategy.options" :key="item.value" :value="item.value">
              {{ item.label}}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="taxRate" label="Tax Rate" v-bind="taxRateProps">
          <n-slider v-model:value="taxRate" :marks="sliderMarks"></n-slider>
        </n-form-item>

        <n-divider />

        <n-form-item path="retirementStrategy" label="Retirement Strategy" v-bind="retirementStrategyProps">
          <n-radio-group v-model:value="retirementStrategy">
            <n-radio-button v-for="item in planForm.retirementStrategy.options" :key="item.value" :value="item.value">
              {{ item.label}}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>

        <n-form-item
            path="retirementAge"
            label="Retirement Age"
            v-bind="retirementAgeProps"
            v-if="retirementStrategy === 'age'"
        >
          <n-input-number v-model:value="retirementAge" />
        </n-form-item>

        <n-form-item
            path="retirementSavingsAmount"
            label="Retirement Savings Amount"
            v-bind="retirementSavingsAmountProps"
            v-if="retirementStrategy === 'target_savings'"
        >
          <n-input-number v-model:value="retirementSavingsAmount" />
        </n-form-item>

        <n-form-item
            path="retirementWithdrawalRate"
            label="Retirement Withdrawal Rate"
            v-bind="retirementWithdrawalRateProps"
            v-if="retirementStrategy === 'percent_rule'"
        >
          <n-input-number v-model:value="retirementWithdrawalRate" />
        </n-form-item>

        <n-form-item
            path="retirementIncomeGoal"
            label="Retirement Income Goal"
            v-bind="retirementIncomeGoalProps"
            v-if="retirementStrategy === 'percent_rule'"
        >
          <n-input v-model:value="retirementIncomeGoal" />
        </n-form-item>
        <n-button :disabled="!meta.valid">
          Submit
        </n-button>
      </n-form>

    </template>

    <template #action>
      <n-button-group>
        <n-button secondary round v-if="mode ==='edit'" type="success" @click="handleUpdate">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          <span>Save</span>
        </n-button>
        <n-button secondary round v-if="mode==='edit'" type="warning" @click="handleCreate">
          <template #icon>
            <Icon name="mdi:content-duplicate"/>
          </template>
          <span>Duplicate</span>
        </n-button>
        <n-button secondary round v-if="mode==='create'" type="success" @click="handleCreate">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          <span>Create</span>
        </n-button>
        <n-button secondary round type="error" @click="handleCancel">
          <template #icon>
            <Icon name="mdi:close"/>
          </template>
          Cancel
        </n-button>
      </n-button-group>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import {planForm, planFormSchema} from "~/forms/planForm";
import type {Plan} from "~/models/plan/Plan";
import * as yup from "yup"

interface Props {
  planPartial: Partial<Plan>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();

const taxBrackets = [
  {min: 0, max: 10, label: "Very Low", colorClass: "text-green-500"},
  {min: 11, max: 20, label: "Low", colorClass: "text-blue-500"},
  {min: 21, max: 30, label: "Medium", colorClass: "text-yellow-500"},
  {min: 31, max: 40, label: "High", colorClass: "text-orange-500"},
  {min: 41, max: 50, label: "Very High", colorClass: "text-red-500"},
];


const sliderMarks = Object.fromEntries(
    taxBrackets.map((bracket) => [
      bracket.max,
      `${bracket.max}%`
    ])
);

const emit = defineEmits(['create', 'update', 'cancel'])

function handleCreate() {
  emit('create', values)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', values)
}

const {defineField, values, errors, handleSubmit, meta } = useForm({
  validationSchema: planFormSchema,
  initialValues: props.planPartial
})

const naiveConfig = (state) => ({
  props: {
    validationStatus: state.errors[0] ? 'error' : undefined,
    feedback: state.errors[0],
  },
});

const [name, nameProps] = defineField('name', naiveConfig);
const [age, ageProps] = defineField("age", naiveConfig);
const [year, yearProps] = defineField("year", naiveConfig);
const [lifeExpectancy, lifeExpectancyProps] = defineField("lifeExpectancy", naiveConfig);
const [taxRate, taxRateProps] = defineField("taxRate", naiveConfig);
const [taxStrategy, taxStrategyProps] = defineField("taxStrategy", naiveConfig);
const [retirementStrategy, retirementStrategyProps] = defineField("retirementStrategy", naiveConfig);
const [retirementAge, retirementAgeProps] = defineField("retirementAge", naiveConfig);
const [retirementSavingsAmount, retirementSavingsAmountProps] = defineField(
    "retirementSavingsAmount",
    naiveConfig
);
const [retirementWithdrawalRate, retirementWithdrawalRateProps] = defineField(
    "retirementWithdrawalRate",
    naiveConfig
);
const [retirementIncomeGoal, retirementIncomeGoalProps] = defineField(
    "retirementIncomeGoal",
    naiveConfig
);


</script>