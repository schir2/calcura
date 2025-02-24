<template>
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
</template>
<script lang="ts" setup>
import {RetirementStrategy} from "~/types/Plan";

const modelRef = defineModel<Plan>()

</script>