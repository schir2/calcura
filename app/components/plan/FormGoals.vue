<template>
  <n-form-item path="retirement_strategy" label="Retirement Strategy">
    <div class="grid grid-cols-4 gap-3 w-full">
      <CommonRadioCard v-model="modelRef.retirement_strategy" :value="'age' as RetirementStrategy"
                       title="Retire by a certain age">
        <n-form-item path="retirement_age" label="Retirement Age">
          <n-input-number class="w-full" v-model:value="modelRef.retirement_age"/>
        </n-form-item>
      </CommonRadioCard>

      <CommonRadioCard v-model="modelRef.retirement_strategy" :value="'target_savings' as RetirementStrategy"
                       title="Reach a savings goal">
        <n-form-item path="retirement_savings_amount" label="Retirement Savings Amount">
          <n-input-number class="w-full" v-model:value="modelRef.retirement_savings_amount"/>
        </n-form-item>
      </CommonRadioCard>

      <CommonRadioCard v-model="modelRef.retirement_strategy" :value="'debt_free' as RetirementStrategy"
                       title="Retire when all debts are paid">
      </CommonRadioCard>

      <CommonRadioCard v-model="modelRef.retirement_strategy" :value="'percent_rule' as RetirementStrategy"
                       title="Percent Rule">
        <n-form-item path="retirement_withdrawal_rate" label="Retirement Withdrawal Rate (%)">
          <n-input-number class="w-full" v-model:value="modelRef.retirement_withdrawal_rate"/>
        </n-form-item>

        <n-form-item path="retirement_income_goal" label="Retirement Income Goal">
          <n-input-number class="w-full" v-model:value="modelRef.retirement_income_goal"/>
        </n-form-item>

        <n-form-item path="retirement_income_adjusted_for_inflation"
                     label="Retirement Income Goal Adjusted For Inflation">
          <n-switch class="w-full" v-model:value="modelRef.retirement_income_adjusted_for_inflation"/>
        </n-form-item>
      </CommonRadioCard>
    </div>
  </n-form-item>
</template>
<script lang="ts" setup>
import type {RetirementStrategy} from "#shared/types/Plan";

const modelRef = defineModel<Plan>()

</script>