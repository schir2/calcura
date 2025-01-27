<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Plan {{ planPartial.id }}: {{ planPartial.name }}</h3>
    </template>
    <template #default>
      <n-form :model="values">
        <section id="planBasicInfo" class="grid grid-cols-4 gap-3">
          <n-form-item path="name" :label="planForm.name.label" v-bind="nameProps">
            <n-input v-model:value="name"></n-input>
          </n-form-item>

          <n-form-item path="age" :label="planForm.age.label" v-bind="ageProps">
            <n-input-number class="w-full" v-model:value="age"/>
          </n-form-item>

          <n-form-item path="year" :label="planForm.year.label" v-bind="yearProps">
            <n-input-number class="w-full" v-model:value="year"/>
          </n-form-item>

          <n-form-item path="lifeExpectancy" :label="planForm.lifeExpectancy.label" v-bind="lifeExpectancyProps">
            <n-input-number class="w-full" v-model:value="lifeExpectancy"/>
          </n-form-item>
        </section>
        <section id="planGrowthAndInflation">
          <n-form-item path="inflationRate" :label="planForm.inflationRate.label" v-bind="inflationRateProps">
            <n-input-number class="w-full" v-model:value="inflationRate"/>
          </n-form-item>
          <n-form-item path="insufficientFundsStrategy" :label="planForm.insufficientFundsStrategy.label" v-bind="insufficientFundsStrategyProps">
            <n-radio-group v-model:value="insufficientFundsStrategy">
              <n-radio-button v-for="option in planForm.insufficientFundsStrategy.options" :key="option.value" :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>
          <n-form-item path="growthRate" :label="planForm.growthRate.label" v-bind="growthRateProps">
            <n-input-number class="w-full" v-model:value="growthRate"/>
          </n-form-item>
          <n-form-item path="growthApplicationStrategy" :label="planForm.growthApplicationStrategy.label" v-bind="growthApplicationStrategyProps">
            <n-radio-group v-model:value="growthApplicationStrategy">
              <n-radio-button v-for="option in planForm.growthApplicationStrategy.options" :key="option.value" :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>
        </section>
        <n-form-item path="taxStrategy" :label="planForm.taxStrategy.label" v-bind="taxStrategyProps">
          <CommonRadioCard v-model="taxStrategy" :value="IncomeTaxStrategy.Simple" title="Simple">
            <n-form-item path="taxRate" :label="planForm.taxRate.label" v-bind="taxRateProps">
              <n-slider v-model:value="taxRate" :marks="sliderMarks"></n-slider>
            </n-form-item>
          </CommonRadioCard>
        </n-form-item>
        <n-form-item path="retirementStrategy" :label="planForm.retirementStrategy.label"
                     v-bind="retirementStrategyProps">

          <div class="grid grid-cols-4 gap-3 w-full">

            <CommonRadioCard v-model="retirementStrategy" :value="RetirementStrategy.Age"
                             title="Retire by a certain age">
              <n-form-item
                  path="retirementAge" :label="planForm.retirementAge.label" v-bind="retirementAgeProps">
                <n-input-number class="w-full" v-model:value="retirementAge"/>
              </n-form-item>
            </CommonRadioCard>

            <CommonRadioCard v-model="retirementStrategy" :value="RetirementStrategy.TargetSavings"
                             title="Reach a savings goal">
              <n-form-item path="retirementSavingsAmount" :label="planForm.retirementSavingsAmount.label" v-bind="retirementSavingsAmountProps">
                <n-input-number class="w-full" v-model:value="retirementSavingsAmount"/>
              </n-form-item>
            </CommonRadioCard>

            <CommonRadioCard v-model="retirementStrategy" :value="RetirementStrategy.DebtFree"
                             title="Retire when all debts are paid">
            </CommonRadioCard>

            <CommonRadioCard v-model="retirementStrategy" :value="RetirementStrategy.PercentRule" title="Percent Rule">
              <n-form-item
                  path="retirementWithdrawalRate" :label="planForm.retirementWithdrawalRate.label"

                  v-bind="retirementWithdrawalRateProps"
              >
                <n-input-number class="w-full" v-model:value="retirementWithdrawalRate"/>
              </n-form-item>

              <n-form-item path="retirementIncomeGoal" :label="planForm.retirementIncomeGoal.label"
                           v-bind="retirementIncomeGoalProps">
                <n-input-number class="w-full" v-model:value="retirementIncomeGoal"/>
              </n-form-item>
              <n-form-item path="retirementIncomeAdjustedForInflation" :label="planForm.retirementIncomeAdjustedForInflation.label"
                           v-bind="retirementIncomeAdjustedForInflationProps">
                <n-switch class="w-full" v-model:value="retirementIncomeAdjustedForInflation"/>
              </n-form-item>
            </CommonRadioCard>
          </div>
        </n-form-item>
      </n-form>
{{ errors}}
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel" :errors="errors"/>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import {planForm, planFormSchema} from "~/forms/planForm";
import {IncomeTaxStrategy, type Plan, RetirementStrategy} from "~/models/plan/Plan";
import {useFieldHelpers} from "~/composables/useFieldHelpers";
import {naiveConfig} from "~/utils/schemaUtils";

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

const [name, nameProps] = defineField('name', naiveConfig)
const [age, ageProps] = defineField('age', naiveConfig)
const [year, yearProps] = defineField('year', naiveConfig)
const [inflationRate, inflationRateProps] = defineField('inflationRate', naiveConfig)
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig)
const [insufficientFundsStrategy, insufficientFundsStrategyProps] = defineField('insufficientFundsStrategy', naiveConfig)
const [growthApplicationStrategy, growthApplicationStrategyProps] = defineField('growthApplicationStrategy', naiveConfig)
const [taxStrategy, taxStrategyProps] = defineField('taxStrategy', naiveConfig)
const [taxRate, taxRateProps] = defineField('taxRate', naiveConfig)
const [lifeExpectancy, lifeExpectancyProps] = defineField('lifeExpectancy', naiveConfig)
const [retirementStrategy, retirementStrategyProps] = defineField('retirementStrategy', naiveConfig)
const [retirementWithdrawalRate, retirementWithdrawalRateProps] = defineField('retirementWithdrawalRate', naiveConfig)
const [retirementIncomeGoal, retirementIncomeGoalProps] = defineField('retirementIncomeGoal', naiveConfig)
const [retirementIncomeAdjustedForInflation, retirementIncomeAdjustedForInflationProps] = defineField('retirementIncomeAdjustedForInflation', naiveConfig)
const [retirementAge, retirementAgeProps] = defineField('retirementAge', naiveConfig)
const [retirementSavingsAmount, retirementSavingsAmountProps] = defineField('retirementSavingsAmount', naiveConfig)

const formFields = ref(useFieldHelpers(planForm, defineField))


</script>