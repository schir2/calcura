<script lang="ts" setup>
import {
  MAX_TAX_RATE,
  MIN_TAX_RATE,
  SLIDER_GROWTH_RATE_MAX,
  SLIDER_INFLATION_RATE_MAX,
  SLIDER_TAX_RATE_MAX,
} from '~/constants/planConstants'

const modelRef = defineModel<Partial<Plan>>({required: true})
</script>

<template>
  <n-form-item path="inflation_rate" label="Inflation rate (%)" :show-feedback="false" class="!mb-3">
    <base-number-slider v-model="modelRef.inflation_rate" :min="0" :max="SLIDER_INFLATION_RATE_MAX" :step="0.1"/>
  </n-form-item>

  <n-form-item path="tax_rate" label="Tax rate (%)" :show-feedback="false" class="!mb-3">
    <base-number-slider
        v-model="modelRef.tax_rate"
        :min="MIN_TAX_RATE"
        :max="Math.min(SLIDER_TAX_RATE_MAX, MAX_TAX_RATE)"
        :step="0.5"/>
  </n-form-item>

  <n-form-item path="growth_rate" label="Default growth rate for new accounts (%)"
               :show-feedback="false" class="!mb-1">
    <base-number-slider v-model="modelRef.growth_rate" :min="0" :max="SLIDER_GROWTH_RATE_MAX" :step="0.5"/>
  </n-form-item>
  <p class="text-xs text-skin-muted">
    The return assumed for investment accounts you add from now on. Accounts you already have keep
    their own rate — changing this never rewrites them.
  </p>
</template>
