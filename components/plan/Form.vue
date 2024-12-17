<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Plan {{ planPartial.id }}: {{ planPartial.name }}</h3>
    </template>
    <template #default>
      <n-form>
        <n-form-item path="name" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"></n-input>
        </n-form-item>

        <n-form-item path="age" v-bind="formFields.age.props">
          <n-input-number v-model:value="formFields.age.value"/>
        </n-form-item>

        <n-form-item path="year" v-bind="formFields.year.props">
          <n-input-number v-model:value="formFields.year.value"/>
        </n-form-item>

        <n-form-item path="lifeExpectancy" v-bind="formFields.lifeExpectancy.props">
          <n-input-number v-model:value="formFields.lifeExpectancy.value"/>
        </n-form-item>

        <n-divider/>

        <n-form-item path="taxStrategy" v-bind="formFields.taxStrategy.props">
          <n-radio-group v-model:value="formFields.taxStrategy.value">
            <n-radio-button v-for="item in planForm.taxStrategy.options" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="taxRate" v-bind="formFields.taxRate.props">
          <n-slider v-model:value="formFields.taxRate.value" :marks="sliderMarks"></n-slider>
        </n-form-item>

        <n-divider/>

        <n-form-item path="retirementStrategy" v-bind="formFields.retirementStrategy.props">
          <n-radio-group v-model:value="formFields.retirementStrategy.value">
            <n-radio-button v-for="item in planForm.retirementStrategy.options" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>

        <n-form-item
            path="retirementAge"

            v-bind="formFields.retirementAge.props"
            v-if="formFields.retirementStrategy.value === 'age'"
        >
          <n-input-number v-model:value="formFields.retirementAge.value"/>
        </n-form-item>

        <n-form-item
            path="retirementSavingsAmount"

            v-bind="formFields.retirementSavingsAmount.props"
            v-if="formFields.retirementStrategy.value === 'target_savings'"
        >
          <n-input-number v-model:value="formFields.retirementSavingsAmount.value"/>
        </n-form-item>

        <n-form-item
            path="retirementWithdrawalRate"

            v-bind="formFields.retirementWithdrawalRate.props"
            v-if="formFields.retirementStrategy.value === 'percent_rule'"
        >
          <n-input-number v-model:value="formFields.retirementWithdrawalRate.value"/>
        </n-form-item>

        <n-form-item
            path="retirementIncomeGoal"

            v-bind="formFields.retirementIncomeGoal.props"
            v-if="formFields.retirementStrategy.value === 'percent_rule'"
        >
          <n-input v-model:value="formFields.retirementIncomeGoal.value"/>
        </n-form-item>
        <n-button :disabled="!meta.valid">
          Submit
        </n-button>
      </n-form>

    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import {planForm, planFormSchema} from "~/forms/planForm";
import type {Plan} from "~/models/plan/Plan";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

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

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: planFormSchema,
  initialValues: props.planPartial
})

const formFields = ref(useFieldHelpers(planForm, defineField))


</script>