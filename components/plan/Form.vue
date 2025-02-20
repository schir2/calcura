<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Plan {{ initialValues.id }}: {{ modelRef.name }}</h3>
    </template>
    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section id="planBasicInfo" class="grid grid-cols-4 gap-3">
          <n-form-item path="name" label="Name">
            <n-input v-model:value="modelRef.name"></n-input>
          </n-form-item>

          <n-form-item path="age" label="Age">
            <n-input-number class="w-full" v-model:value="modelRef.age"/>
          </n-form-item>

          <n-form-item path="year" label="Year">
            <n-input-number class="w-full" v-model:value="modelRef.year"/>
          </n-form-item>

          <n-form-item path="lifeExpectancy" label="Life Expectancy">
            <n-input-number class="w-full" v-model:value="modelRef.lifeExpectancy"/>
          </n-form-item>
        </section>

        <section id="planGrowthAndInflation" class="grid grid-cols-4 gap-3">
          <n-form-item path="inflationRate" label="Inflation Rate">
            <n-input-number class="w-full" v-model:value="modelRef.inflationRate"/>
          </n-form-item>

          <n-form-item path="growthRate" label="Growth Rate">
            <n-input-number class="w-full" v-model:value="modelRef.growthRate"/>
          </n-form-item>

          <n-form-item path="insufficientFundsStrategy" label="Allow Negative Funds">
            <n-radio-group v-model:value="modelRef.insufficientFundsStrategy">
              <n-radio-button v-for="option in insufficientFundsStrategyOptions" :key="option.value"
                              :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>

          <n-form-item path="growthApplicationStrategy" label="Growth Application Strategy">
            <n-radio-group v-model:value="modelRef.growthApplicationStrategy">
              <n-radio-button v-for="option in growthApplicationStrategyOptions" :key="option.value"
                              :label="option.label" :value="option.value"/>
            </n-radio-group>
          </n-form-item>
        </section>

        <n-form-item path="taxStrategy" label="Tax Strategy">
          <CommonRadioCard v-model="modelRef.taxStrategy" :value="IncomeTaxStrategy.Simple" title="Simple">
            <n-form-item path="taxRate" label="Tax Rate (%)">
              <n-slider v-model:value="modelRef.taxRate" :marks="sliderMarks"></n-slider>
            </n-form-item>
          </CommonRadioCard>
        </n-form-item>

        <n-form-item path="retirementStrategy" label="Retirement Strategy">
          <div class="grid grid-cols-4 gap-3 w-full">
            <CommonRadioCard v-model="modelRef.retirementStrategy" :value="RetirementStrategy.Age"
                             title="Retire by a certain age">
              <n-form-item path="retirementAge" label="Retirement Age">
                <n-input-number class="w-full" v-model:value="modelRef.retirementAge"/>
              </n-form-item>
            </CommonRadioCard>

            <CommonRadioCard v-model="modelRef.retirementStrategy" :value="RetirementStrategy.TargetSavings"
                             title="Reach a savings goal">
              <n-form-item path="retirementSavingsAmount" label="Retirement Savings Amount">
                <n-input-number class="w-full" v-model:value="modelRef.retirementSavingsAmount"/>
              </n-form-item>
            </CommonRadioCard>

            <CommonRadioCard v-model="modelRef.retirementStrategy" :value="RetirementStrategy.DebtFree"
                             title="Retire when all debts are paid">
            </CommonRadioCard>

            <CommonRadioCard v-model="modelRef.retirementStrategy" :value="RetirementStrategy.PercentRule"
                             title="Percent Rule">
              <n-form-item path="retirementWithdrawalRate" label="Retirement Withdrawal Rate (%)">
                <n-input-number class="w-full" v-model:value="modelRef.retirementWithdrawalRate"/>
              </n-form-item>

              <n-form-item path="retirementIncomeGoal" label="Retirement Income Goal">
                <n-input-number class="w-full" v-model:value="modelRef.retirementIncomeGoal"/>
              </n-form-item>

              <n-form-item path="retirementIncomeAdjustedForInflation"
                           label="Retirement Income Goal Adjusted For Inflation">
                <n-switch class="w-full" v-model:value="modelRef.retirementIncomeAdjustedForInflation"/>
              </n-form-item>
            </CommonRadioCard>
          </div>
        </n-form-item>
      </n-form>

    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import {IncomeTaxStrategy, type Plan, planDefaults, RetirementStrategy} from "~/models/plan/Plan";
import {usePlanValidator} from "~/composables/validators/usePlanValidator";

interface Props {
  initialValues?: Partial<Plan>;
  mode?: 'create' | 'edit'
}

const {initialValues = planDefaults, mode='create'} = defineProps<Props>();
const emit = defineEmits(['create', 'update', 'cancel'])
const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<Plan>(initialValues, emit, usePlanValidator);


const insufficientFundsStrategyOptions = [
  {value: 'none', label: 'No'},
  {value: 'minimum_only', label: 'Pay Minimums'},
  {value: 'full', label: 'Allow'},
]

const growthApplicationStrategyOptions = [
  {value: 'start', label: 'Start of Year'},
  {value: 'end', label: 'End of Year'},
]

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

</script>