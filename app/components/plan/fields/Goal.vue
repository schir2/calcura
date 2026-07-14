<script lang="ts" setup>
import type {RetirementStrategy} from '#shared/types/Plan'
import {
  MAX_RETIREMENT_AGE_FOR_WITHDRAWAL,
  MAX_RETIREMENT_WITHDRAWAL_RATE,
  MIN_RETIREMENT_AGE_FOR_WITHDRAWAL,
  MIN_RETIREMENT_WITHDRAWAL_RATE,
  SLIDER_RETIREMENT_INCOME_GOAL_MAX,
  SLIDER_RETIREMENT_SAVINGS_MAX,
} from '~/constants/planConstants'

const modelRef = defineModel<Partial<Plan>>({required: true})

const STRATEGY_OPTIONS: {value: RetirementStrategy; label: string; hint: string}[] = [
  {value: 'age', label: 'Retire at an age', hint: 'Stop working the year you hit a target age'},
  {value: 'target_savings', label: 'Reach a savings goal', hint: 'Retire once your investments hit a number'},
  {value: 'debt_free', label: 'Retire debt-free', hint: 'Retire the year your last debt is paid off'},
  {value: 'percent_rule', label: 'Percent rule', hint: 'Retire when withdrawals can cover your income goal'},
]
</script>

<template>
  <common-strategy-rows v-model="modelRef.retirement_strategy" :options="STRATEGY_OPTIONS">
    <template #age>
      <n-form-item path="retirement_age" label="Retirement age" :show-feedback="false">
        <base-number-slider
            v-model="modelRef.retirement_age"
            :min="MIN_RETIREMENT_AGE_FOR_WITHDRAWAL"
            :max="MAX_RETIREMENT_AGE_FOR_WITHDRAWAL"
            :step="1"/>
      </n-form-item>
    </template>

    <template #target_savings>
      <n-form-item path="retirement_savings_amount" label="Savings target" :show-feedback="false">
        <base-number-slider
            v-model="modelRef.retirement_savings_amount"
            :min="0"
            :max="SLIDER_RETIREMENT_SAVINGS_MAX"
            :step="10000"/>
      </n-form-item>
    </template>

    <template #percent_rule>
      <n-form-item path="retirement_withdrawal_rate" label="Withdrawal rate (%)" :show-feedback="false" class="!mb-3">
        <base-number-slider
            v-model="modelRef.retirement_withdrawal_rate"
            :min="MIN_RETIREMENT_WITHDRAWAL_RATE"
            :max="MAX_RETIREMENT_WITHDRAWAL_RATE"
            :step="0.1"/>
      </n-form-item>

      <n-form-item path="retirement_income_goal" label="Retirement income goal" :show-feedback="false" class="!mb-3">
        <base-number-slider
            v-model="modelRef.retirement_income_goal"
            :min="0"
            :max="SLIDER_RETIREMENT_INCOME_GOAL_MAX"
            :step="1000"/>
      </n-form-item>

      <n-form-item path="retirement_income_adjusted_for_inflation" :show-feedback="false">
        <n-switch v-model:value="modelRef.retirement_income_adjusted_for_inflation">
          <template #checked>Adjusted for inflation</template>
          <template #unchecked>In today's dollars</template>
        </n-switch>
      </n-form-item>
    </template>
  </common-strategy-rows>
</template>
